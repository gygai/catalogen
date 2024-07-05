import {Application, Context, Router} from "https://deno.land/x/oak/mod.ts";
import {createRemoteJWKSet, type FlattenedJWSInput, jwtVerify} from 'https://deno.land/x/jose/index.ts';
import * as log from "https://deno.land/std@0.216.0/log/mod.ts";
import {oakCors} from "https://deno.land/x/cors/mod.ts";
import { Session ,CookieStore} from "https://deno.land/x/oak_sessions/mod.ts";

const router = new Router();
const port = Deno.env.get("PORT") || 3000;
 const store = new CookieStore('very-secret-key')

type AppState = {
  session: Session
}
const app = new Application<AppState>()
app.addEventListener('error', (evt) => {
  console.log(evt.error)
})



await log.setup({
  handlers: {
    console: new log.ConsoleHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
});


//general middelweres  
async function logTrace(ctx: Context, next: () => Promise<unknown>) {
  try{
    log.debug(`[Original Request] ${ctx.request.method} ${ctx.request.url}`);
    await next();
    log.debug(`[Upstream Response]  status: ${ctx.response.status} body: ${ctx.response.body}` );
    ctx.response.headers.set('Access-Control-Allow-Origin', "*")
    ctx.response.headers.set('Access-Control-Allow-Methods', "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS")
    ctx.response.headers.set('Access-Control-Allow-Headers', "*")
    ctx.response.headers.set('Access-Control-Allow-Credentials', "true")
    for (const key of ctx.response.headers.keys()) {
      log.debug(`${key}: ${ctx.response.headers.get(key)}`)
    }

  }catch(error){
    log.error(error);
    throw error;
  }
}


//upstream middelweres
async function addAuthorizationToContext(ctx: Context, next: () => Promise<unknown>) {
  if(!ctx.state.app){
    log.info('no app in ctx');
    return await next();
  }


  const token = await getToken();
  ctx.state.authorization = `Bearer ${token}`;
  console.debug(ctx.state)
  return await next();

  async function getToken(): Promise<string> {
    const creds = ctx.state.app ;
    console.log(creds);
    const db = await Deno.openKv();
    let token = await db.get([creds.tokenurl]);
    if (token && token.value) return token.value;
    log.debug(`[Token Request] request token from ${creds.tokenurl}`);

    const res = await fetch(`${creds.tokenurl}?grant_type=client_credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${creds.clientid}:${creds.clientsecret}`)}`
      },
      body: JSON.stringify({
        client_id: creds.clientid,
        client_secret: creds.clientsecret,
        grant_type: "client_credentials",
      }),
    });
    const data = await res.json();
    if(!data.access_token){
      throw new "token request has failed"
    }
    token = data.access_token;
    log.debug(token);
    await db.set([creds.tokenurl], token);
    return token;
  }
}

async function generalRouting(ctx: Context, next: () => Promise<unknown>) {
  if(!ctx.state.authorization || !ctx.state.app){
    log.info('no app in ctx');
    ctx.response.status = 401;
    ctx.response.body = ctx.state.auth_error;
    return;
  }

  const creds = ctx.state.app;

  const url = getTargetUrl(ctx);
  const headers = Object.fromEntries(ctx.request.headers.entries());
  const additionalHeaders= JSON.parse(creds.headers);
  const body = await getBodyInit(ctx);

  const options = {
    method: ctx.request.method,
    headers:  {...additionalHeaders, "Content-Type": "application/json",    "Authorization" :ctx.state.authorization },
    body: body
  };

  log.debug(`[Upstream Request] ${options.method} ${url}`);
  log.debug(`[Upstream Request - Headers] ${JSON.stringify(options.headers, 2, null )}`);
  log.debug(`[Upstream Request - Body] ${JSON.stringify(options.body, 2, null )}`);
  const response = await fetch(url, options);

  if (response.status === 401 || response.status === 403) {
    const db = await Deno.openKv();
    await db.delete([creds.tokenurl]);
  }

  const resBody = await response.text();
  log.debug(`[Upstream Resonse] ${response.status}  ${response.statusText} body: ${resBody} headers: ${JSON.stringify(response.headers.entries())}`);
  for (const key of response.headers.keys()) {
    log.debug(`${key}: ${response.headers.get(key)}`)
  }

  // ctx.response.headers = new Headers(response.headers);

  // ctx.response.headers = new Headers({
  //   'Access-Control-Allow-Origin': "*",
  //   'Access-Control-Allow-Methods': "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  //   'Access-Control-Allow-Headers: "*"
  // });
  ctx.response.headers.set('Access-Control-Allow-Origin', "*")
  ctx.response.headers.set('Access-Control-Allow-Methods', "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS")
  ctx.response.headers.set('Access-Control-Allow-Headers', "*")
  ctx.response.headers.set('Access-Control-Allow-Credentials', "true")

  ctx.response.body = resBody;
  ctx.response.status = response.status;

  await next();

  function getTargetUrl(ctx: Context){
    const path = ctx.request.url.pathname
        .replace('openai', 'inference')
        .replace("gpt-4-32k", "d76615bc07d01db5")
        .replace("gpt-4-turbo-preview","d76615bc07d01db5");
    
    

    const url = new URL(path, ctx.state.app.url);
    url.search = ctx.request.url.search;
    if(!url.searchParams.get('api-version')){
      url.search = url.search + `&api-version=${ctx.state.app.version || '2023-05-15'}`
    }
    return url;
  }

  function getBodyInit(
      ctx
  ): BodyInit | null {
    if (!ctx.request.hasBody) {
      return null;
    }
    return ctx.request.body.text();
  }

}


//authentication middelweres
const idp ={
  client_id: Deno.env.get("idp.client_id"),
  client_secret: Deno.env.get("idp.client_secret"),
  iss: Deno.env.get("idp.iss"),
  jwks : `${Deno.env.get("idp.iss")}/.well-known/jwks`,
  authorize:  `${Deno.env.get("idp.iss")}/authorize`,
  token: `${Deno.env.get("idp.iss")}/token`
}

const getRedirectUri = (request: Request)=> `${request.url.origin}/auth/callback`

async function getApp(token: string,  app_id:string) {
  const JWKS = createRemoteJWKSet(new URL(idp.jwks));
  const {payload} = await jwtVerify(token as FlattenedJWSInput, JWKS) as {payload: {apps: any[]}};
  log.debug('authToken|payload\t' , JSON.stringify(payload)); 

  return payload.apps?.filter(app=> app.id === app_id)[0]
}


  async function authToken(ctx: Context,  next: () => Promise<unknown>) {
    log.debug('authToken' + await ctx.state.session.get("auth-token"));

    ctx.state.token = await ctx.state.session.has("auth-token") ?  await ctx.state.session.get("auth-token"): await getToken(ctx)  
    await next();
    await ctx.state.session.set("auth-token", ctx.state.token);

    async function getToken(ctx: Context) {
     return ctx.request.headers.get("api-key") 
         ?? ctx.request.headers.get("Authorization")?.replace("Bearer ", "") 
         ?? ctx.request.url.searchParams.get('auth')
         ?? await ctx.cookies.get("x-id");     
    }
  }

  async function jwtAuthn(ctx: Context,  next: () => Promise<unknown>) {

    if (ctx.state.token) { 
      try {
        ctx.state.app_id = ctx.request.url.origin.replace('.deno.dev', '').replace('https://', '')
        ctx.state.app = await getApp(ctx.state.token, ctx.state.app_id); 
      } catch (error) {
        ctx.state.auth_error = `Unauthorized: ${error.message}`;
        log.error('jwtAuthn failed' + error + JSON.stringify(ctx.request.url.searchParams));
      }  
    }
    else {
      ctx.state.auth_error = "Unauthorized: Missing token";
      log.warn(ctx.state.auth_error , await ctx.state.session.get("auth-token"));
    }

    await next();

}



//authentication routes
router.get("/auth/callback", async (ctx) => {
  const code = ctx.request.url.searchParams.get("code");
  const originalUrl = ctx.request.url.searchParams.get("state");

  if (!code || !originalUrl) {
    ctx.response.status = 400;
    ctx.response.body = "Bad Request: Missing code or original URL state";
    return;
  }

  try {
    // Exchange the code for tokens
    const tokenResponse = await fetch(idp.token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(getRedirectUri(ctx.request))}&client_id=${idp.client_id}&client_secret=${idp.client_secret}`,
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();
    const idToken = tokenData.id_token;
    const auth= `Bearer ${idToken}`;
    // const cookies = new CookieMap(ctx.request, { response:ctx.response, secure: true });
    // console.log("cookie ser" ,cookies, ctx.request.url, ctx.cookies);
    // cookies.set("session", "1234567");
    // cookies.set( "x-id", idToken, { httpOnly: true, sameSite: "none", domain:ctx.request.url.origin, secure: true, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) })



    // await ctx.cookies.set( "x-id", idToken, { httpOnly: true, sameSite: "none", domain:ctx.request.url.origin, expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) });

    ctx.state.token = idToken;
    await ctx.state.session.set("auth-token", idToken);
    // Redirect back to the original URL with the id_token in the authorization header
    ctx.response.redirect(originalUrl);

  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = `Internal Server Error: ${error.message}`;
  }
});





//index view

async function unauthorizedView(ctx: Context) {
  ctx.response.status = 200;
  ctx.response.type ="html";
  ctx.response.body =  `
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="relative min-h-screen bg-slate-700 bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
            <main class=" min-h-[80vh] ">
                <div class="container px-8 mx-auto mt-16 lg:mt-32 ">
                    <span class="block text-2xl font-bold text-zinc-50">Authorization Required</span> 
                    <span class="block text-m text-zinc-50">Please authorize to access the API</span>
                    <div class="flex items center justify-end gap-4 mt-4">
                        <a href="${authorizationUrl(ctx)}" class=" " >
                            <button class="x-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Authorize
                            </button>
                        </a>
                    </div>
                 
                    <div class="block flex items center justify-end gap-4 mt-4">
                    ${ctx.state.auth_error && `<blockquote></blockquote><pre class="bg-slate-500 text-red text-m">${ctx.state.auth_error}</pre></blockquote>`}
                    </div>
                       
                </div>
            </main>
        </body>
        </html>
        `;
}
  
  

async function debug(ctx: Context) {
  // ctx.response.body =  JSON.stringify(ctx.state);
   if(!ctx.state.app) { 
     return unauthorizedView(ctx);
   }
  

// ## as azure ai
//   AZURE_OPENAI_BASE_PATH=https://${ctx.request.url.host}/v2/inference/deployments
//   AZURE_OPENAI_API_KEY=${ctx.state.token}
//   AZURE_OPENAI_API_VERSION=${ctx.state.app.version || '2023-05-15'}
//   AZURE_OPENAI_API_DEPLOYMENT_NAME=${ctx.state.app.deployment || 'd74b3f70ae904c59'}
//   AZURE_OPENAI_API_MODEL_NAME=${ctx.state.app.model || 'gpt-4o'}
//
// ## as azure ai embedding
//   AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=d46a41614d663ab6
//   AZURE_OPENAI_API_EMBEDDINGS_MODEL_NAME=text-embedding-ada-002

  const url=`https://${ctx.request.url.host}/v2/inference/deployments/${ctx.state.app.deployment || 'd74b3f70ae904c59'}`
  const api_version=ctx.state.app.version || '2023-05-15'
  const model=ctx.state.app.model || 'gpt-4o'
  const envText =` 
  ## as open-api
  OPENAI_BASE_URL=${url}
  OPENAI_API_KEY=${ctx.state.token}
  OPENAI_API_VERSION=${api_version}
  OPENAI_MODEL_NAME=${model} 
  
  ### legacy sdks
  OPENAI_API_BASE_PATH=${url}

  ` 
  
  const azureOpenaiEnv = `
    ## as azure ai
    AZURE_OPENAI_BASE_PATH=https://${ctx.request.url.host}/v2/inference/deployments
    AZURE_OPENAI_API_KEY=${ctx.state.token}
    AZURE_OPENAI_API_VERSION=${api_version}
    AZURE_OPENAI_API_DEPLOYMENT_NAME=${ctx.state.app.deployment || 'd74b3f70ae904c59'}
    AZURE_OPENAI_API_MODEL_NAME=${model}
    AZURE_RESOURCE_GROUP=${ctx.state.app.resource_group || 'default'}
    AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME=${ctx.state.app.embeddings_deplyment || 'd74b3f70ae904c59'}
    AZURE_OPENAI_API_EMBEDDINGS_MODEL_NAME=${ctx.state.app.embeddings_model || 'text-embedding-ada-002'}
`
  const examples = [   {
    "messages": [
      {
        "role": "system",
        "content": "Hello, how are you?"
      },
      {
        "role": "user",
        "content": "I'm doing great, thanks for asking!"
      }
    ],
    "max_tokens": 60,
    "temperature": 0.7
  }]
      .map(JSON.stringify).flatMap((example) => ([{
        title: "Direct SAP AI API", 
        description: "This is an example of how the proxy will call the SAP AI API",
        body: example,
    method: "POST",
    url: `${ctx.state.app.url}/v2/inference/deployments/${ctx.state.app.deployment || 'd74b3f70ae904c59'}/chat/completions?api-version=${ctx.state.app.version || '2023-05-15'}`,
    token: ctx.state.authorization.split(' ')[1], 
    headers: {
      "Content-Type": "application/json",
      "Authorization": ` ${ctx.state.authorization}`,
      ...JSON.parse(ctx.state.app.headers || '{}')
    }},{
        title: "SAP AI as OpenAI API",
        description: "This is an example of how the sdk will call the proxy API",
        url: `${url}/chat/completions`,
        method:  "POST",
        token:ctx.state.token,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ctx.state.token}`,
        },
        body: example
      }  ])).map((exa)=>({
    ...exa,
    httpText: httpText(exa)

  })).reverse();
  
 
  function httpText({method, url, headers, body}){
    return `
    ${method} ${url} 
    ${Object.entries(headers).map(([key, value])=> `${key}: ${value}`).join('\n')}

    ${body}
    `;
  }



  ctx.response.body =  `
  <html>
  <head>
      <script src="https://cdn.tailwindcss.com"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css" /> 
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-coy.min.css" />

  </head> 
  <script>  
    let envText = \`${envText}\`;                
    function copyToClipboard() {
        navigator.clipboard.writeText(envText).then(() => {
            console.log('Text copied to clipboard');
        });
    } 
    const examples = ${JSON.stringify(examples)};
    
    function httpText({method, url, headers, body}){
          return \`
        \${method} \${url}
        \${Object.entries(headers).map(([key, value])=> \`\${key}: \${value}\`).join('\n')}
      
          \${body}
          \`;
      }

    function exec({url,...req}){
      return  fetch(url, req).then(response => response.json()).then(data => {
            console.log('Success:', data);
            return data;
        }).catch((error) => {
            console.error('Error:', error);
        });
    }
         
  </script>
  <body class="relative min-h-screen bg-slate-700 bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
      <main class=" min-h-[80vh] ">
        <div class="container px-8 mx-auto mt-16 lg:mt-32 ">
          
             <span class="text-lg font-bold text-zinc-50 block">Environment Variables</span> 
                <span class="text-m text-zinc-50">
               Use the following environment variables to integrate as OpenAI provider. 
               </span> 
            <pre prettytext class="prism-code language-bash syntax-theme_pre__gn2yG flex overflow-x-auto">
              <code class="px-4 text-left"> 
              ${envText}
              </code>
            </pre>  
            <div class="flex items-center justify-end gap-4 mt-4"> 
                <button onclick="copyToClipboard()" type="button" class="relative inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150 border rounded text-zinc-700 border-zinc-300 bg-zinc-50 hover focus:border-zinc-500 focus:outline-none hover:text-zinc-50 hover:bg-zinc-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg> <span>Copy</span></button>
            </div>
        </div>  
          <div class="grid grid-flow-row-dense grid-cols-3 grid-rows-1   gap-6 m-4 *:bg-slate-500 *:border *:rounded-3xl *:space-x-4 *:md:p-8 *:text-left">
           <div >
             <a href="https://sdk.vercel.ai/docs/introduction" class="text-sky-200  underline" >@ai-sdk</a>
             <blockquote><pre prettytext class="text-wrap text-balance text-pretty bg-slate-200 language-js "><code> import { createOpenAI } from '@ai-sdk/openai';
 
 createOpenAI({ 
      baseURL: process.env.OPENAI_BASE_URL 
     }).chat('${model}') 
      </code></pre>
            </blockquote>
            </div>
            <div >
                <a href="https://langchainjs.com/docs" class="text-sky-200 underline">@langchainjs</a>
                 <blockquote><pre  class="text-wrap text-balance text-pretty  bg-slate-200 language-js"> <code> import { OpenAI } from '@langchain/openai';
 
 new OpenAI({ configuration:{ 
    baseURL: process.env.OPENAI_BASE_URL  
    }});  
    </code></pre> 
                </blockquote>
            </div> 
             <div >
                <a href="https://stately.ai/docs/agents" class="text-sky-200 underline">agent</a>
                 <blockquote><pre  class="text-wrap bg-slate-200 language-js"> <code> import { createAgent } from '@statelyai/agent';



createAgent({
  model: createOpenAI({ baseURL: process.env.OPENAI_BASE_URL })
        .chat('${model}'),
  events: ...      
        </code></pre> 
                </blockquote>
            </div> 
        </div>
       
        
        <div class="container px-8 mx-auto my-auto ">
                <span class="text-2xl font-bold text-zinc-50">API Examples</span> 
            ${examples.map((example, index) => `
    
            <div class="container px-8 mx-auto space-y-4 rounded-3xl space-x-4 bg-slate-500 border pt-6 md:p-8 text-center md:text-left my-6">
               <span class="text-2xl font-bold text-zinc-50 block">${example.title}</span>  
               <span class="text-m text-zinc-50">${example.description}</span>
    
                <pre prettytext class="prism-code language-bash syntax-theme_pre__gn2yG flex overflow-x-auto">
                  <code class="px-4 text-left" >
                     ${httpText(example)}
                  </code>
                </pre>
                <div class="flex items-center justify-end gap-4 mt-4">
                <a href="https://jwt.io/#debugger-io?token=${encodeURIComponent(example.token)}" class="text-blue-500 underline">jwt.io</a>
                <button onclick="navigator.clipboard.writeText('${encodeURIComponent(example.httpText)}')" type="button" class="inline-flex items-center px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150 border rounded text-zinc-700 border-zinc-300 bg-zinc-50 hover focus:border-zinc-500 focus:outline-none hover:text-zinc-50 hover:bg-zinc-900"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path></svg> <span>Copy</span></button>
                <button onclick="exec(examples[${index}])"  class="top 0 px-4 py-2 -ml-px space-x-2 text-sm font-medium duration-150 border rounded text-zinc-700 border-zinc-300 bg-zinc-50 hover focus:border-zinc-500 focus:outline-none hover:text-zinc-50 hover:bg-zinc-900">
                    Execute
                </button>
                </div>
                  
            </div>
            `).join('')} 
            </div>
      </main> 
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/9000.0.1/components/prism-bash.min.js"></script>
    </body>
    </html>`;

  ctx.response.status = 200;
  ctx.response.type ="html"; 
}


function authorizationUrl(ctx: Context){
    const originalUrl = encodeURIComponent(ctx.request.url.toString());
    return `${idp.authorize}?client_id=${idp.client_id}&response_type=code&scope=${encodeURIComponent("openid apps")}&redirect_uri=${encodeURIComponent(getRedirectUri(ctx.request))}&state=${originalUrl}`;
 }
async function redirectToAuthorization(ctx: Context, next: () => Promise<unknown>) {
  if (!ctx.state.app) { 
    ctx.response.redirect(authorizationUrl(ctx));
  }

  await next();

}
  


app.use(oakCors({
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204 

})); // Enable CORS for All Routes
app.use(Session.initMiddleware(store, {
  cookieSetOptions: {
    httpOnly: false  
  },
  cookieGetOptions: {}
}));
router.get(
    "/debug",
    logTrace,
    authToken,
    jwtAuthn,
    addAuthorizationToContext,
    debug
);


router.get(
    "/",
    logTrace,
    authToken, 
    jwtAuthn,
    addAuthorizationToContext,
    redirectToAuthorization,
    debug
);



router.post(
    "/:path*",
    logTrace,
    authToken, 
    jwtAuthn,
    addAuthorizationToContext,
    generalRouting
);


app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: +port });
console.log(`Server running on port ${port}`);
