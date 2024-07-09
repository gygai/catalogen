/** @jsx jsx */
/** @jsxFrag Fragment */
/** @jsxImportSource npm:hono/jsx */
import { Context, Hono } from "npm:hono@4.4.11";
import { jsxRenderer, useRequestContext } from "npm:hono@4.4.11/jsx-renderer";
import { load } from "https://deno.land/std@0.224.0/dotenv/mod.ts";
import { getCookie, setCookie } from "npm:hono/cookie";
import { decode } from "npm:hono/jwt";
import { createRemoteJWKSet, JWTPayload, jwtVerify } from "npm:jose";
import * as log from "https://deno.land/std@0.216.0/log/mod.ts";

await load({ export: true });
type Variables = {
  message: string;
  "auth:payload": JWTPayload;
  "auth:token": string;
  "auth:error": string;
};

const app = new Hono<{ Variables: Variables }>();

const iss = Deno.env.get("OIDC_ISSUER");
const idp = {
  client_id:  Deno.env.get("OIDC_CLIENT_ID"),
  client_secret: Deno.env.get("OIDC_CLIENT_SECRET"),
  iss: Deno.env.get("OIDC_ISSUER"),
  authorize: `${Deno.env.get("OIDC_ISSUER")}/authorize`,
  token: `${Deno.env.get("OIDC_ISSUER")}/token`,
  jwks: createRemoteJWKSet(new URL(`${iss}/.well-known/jwks`)),
  scopes: "openid apps",
  authorizationUrl(ctx: Context, originalUrl: string = "/auth/profile") {
    return `${idp.authorize}?client_id=${idp.client_id}&response_type=code&scope=${
      encodeURIComponent(idp.scopes)
    }&redirect_uri=${encodeURIComponent(idp.redirectUri(ctx))}&state=${
      encodeURIComponent(originalUrl)
    }`;
  },
  redirectUri: (c: Context) => `${new URL(c.req.url).origin}/auth/callback`,
};

app.use(
  "*",
  jsxRenderer(
    ({ children }) => {
      const c = useRequestContext();
      const message = c.get("message");

      return (
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <title>Login to ${new URL(c.req.url).hostname}</title>
          </head>
          <body class="relative min-h-screen bg-slate-700 bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
            {children}

            {message && (
              <div class="block flex items center justify-end gap-4 mt-4">
                <blockquote>
                  <pre class="bg-slate-500 text-zinc-50 text-m">{message}</pre>
                </blockquote>
              </div>
            )}
          </body>
        </html>
      );
    },
    {
      docType:
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    },
  ),
);

app.use(
  "*",
  async (c: Context, next: () => Promise<void>) => {
    const token = getCookie(c, "auth-token") || c.req.header("Authorization")?.replace("Bearer ", "");
    c.set("auth:token", token);
    if (token) {
      const { payload } = await jwtVerify(token!, idp.jwks)
        .catch((e) => {
          log.error("authToken|error\t", e.message);
          c.set("auth:token", undefined);
          c.set("auth:error", e.message);
          return { payload: undefined };
        });
      c.set("auth:payload", payload);
    }
    return next();
  },
);

app.get("/auth/callback", async (c) => {
  const code = c.req.query("code");
  const originalUrl = c.req.query("state");

  if (!code) {
    return c.text("Bad Request: Missing code", 400);
  }

  const tokenResponse = await fetch(idp.token, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${
      encodeURIComponent(idp.redirectUri(c))
    }&client_id=${idp.client_id}&client_secret=${idp.client_secret}`,
  });

  const tokenData = await tokenResponse.json();
  const idToken = tokenData.id_token as string;
  setCookie(c, "auth-token", idToken);
  c.set("auth:token", idToken);
  c.set("auth:payload", decode(idToken).payload);

  return c.redirect(originalUrl || "/auth/profile");
});

app.get("/auth/login", (c) => {
  const authError = c.get("auth:error");
  return c.render(
    <main class=" min-h-[80vh] ">
      <div class="container px-8 mx-auto mt-16 lg:mt-32 ">
        <span class="block text-2xl font-bold text-zinc-50">
          Authorization Required
        </span>
        <span class="block text-m text-zinc-50">
          Please authorize to access the API
        </span>
        <div class="flex items center justify-end gap-4 mt-4">
          <a href={idp.authorizationUrl(c)}>
            <button class="x-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Authorize
            </button>
          </a>
        </div>
        {authError &&
          (
            <div class="block flex items center justify-end gap-4 mt-4">
              <blockquote>
                <pre class="bg-slate-500 text-zinc-50 text-m">{authError}</pre>
              </blockquote>
            </div>
          )}
      </div>
    </main>,
  );
});

app.get("/auth/profile", async (c) => {
  const auth = c.get("auth:payload");
  const token = c.get("auth:token");
  if (!token) {
    return c.redirect("/auth/login");
  }
  return c.render(
    <div>
      <h1 class="x-1/2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Welcome to the Deno OAuth2 Example
      </h1>
      <p class="block text-m text-zinc-50">Logged in as {auth?.email}</p>
      <iframe
        class={"min-h-[100vh]"}
        src={`https://jwt.io?token=${encodeURIComponent(token || "")}`}
        width="100%"
        height="100%"
      >
      </iframe>
      <p>
        <a href="/logout">Logout</a>
      </p>
    </div>,
  );
});

app.get("/", (ctx) => {
  const token = getCookie(ctx, "auth-token");
  return !token ? ctx.redirect("/auth/login") : ctx.redirect("/auth/profile");
});

app.use((c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  c.res.headers.set("Access-Control-Allow-Credentials", "true");
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  );
  return next();
});

const port = Deno.env.get("PORT")
  ? Number.parseInt(Deno.env.get("PORT")!)
  : 3000;
Deno.serve({ port: port }, app.fetch);
console.log(`Server running on port ${port}`);

/*


app.get("/env",  (ctx) => {
    const envText=Object.entries(Deno.env.toObject()).map(([key, value]) => `${key}=${value}`).join("\n");
   return  ctx.render(
        <body>
        <h1>Environment Variables</h1>
        <blockquote><pre>{envText}</pre> </blockquote>
        </body>
        )

})

 */
