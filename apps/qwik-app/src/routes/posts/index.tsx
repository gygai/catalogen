import {RequestHandler} from "@builder.io/qwik-city";
 import {useProvider} from "~/routes/layout";
 


export const onGet: RequestHandler = async ({ redirect, url,cookie,headers,sharedMap }) => {
      
    // Control caching for this request for best performance and to reduce hosting costs:
    // https://qwik.dev/docs/caching/
    const code = url.searchParams.get('code');
    const {clientId, redirectUri, clientSecret} = await useProvider();
    
    //exchange intagram code for token
    if (code) {
        const tokenUrl = 'https://api.instagram.com/oauth/access_token'
        const options ={
            method: 'POST',

            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri(url.origin),
                code: code,
            }),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'accept': 'application/json',
            }};
        console.log('code',tokenUrl, options);
        const token = await fetch(tokenUrl, options).then((res) => res.json());
        token.token_type = "bearer";
        // body.expires_in = body.expires_in;

        // Calculate the `expires_at` Unix timestamp by adding `expires_in` to the current timestamp
        const currentTimestampInSeconds = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
        token.expires_at = currentTimestampInSeconds + token.expires_in || 60 * 30;
        
        console.log('token', token);
        cookie.set('i-access_token', token , { httpOnly: true, domain: url.hostname, secure: true, sameSite: 'strict'});
        //send token to the auth server
        //return access token to the client
    }
     console.log('redirect', url);
     
    throw  redirect(302, url.origin);

    

};
  
 
/*
https://api.instagram.com/oauth/access_token {
  body: URLSearchParams {
    'redirect_uri' => 'https://local.pyzlo.com/auth/callback/instagram',
    'code_verifier' => 'UzHvC-3HFvBvtz51WfAggj6w0tqulCL5Ve-ZHZ9RAe8',
    'code' => 'AQASVzYVYPY3rfdsJ3iEnCBRhxnyUpL6iFVpE182KONLvss0QkrVirfBPw6FdhZ5VrugkXn_e3XtgN0GrqRHh02LWYs3CRiWIXhZvv9PWNv0h83zapy5DYnI8xlxxrhvK7bQu-scmzLf_lbJs6rQdrx5mQsJFfrY2vy-CMedAo5_-9BGqzJaS1KmxJ0zdEgFI4qs3ivmvACikP0Bm9orA1rJQqn4zlrU1z21MtjYpLIkxQ',
    'grant_type' => 'authorization_code',
    'client_id' => '362485702774061',
    'client_secret' => '2591e0e9df97a0357e332f7517cd2655' },
  headers: {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'user-agent': 'oauth4webapi/v2.11.1'
  },
  method: 'POST',
  redirect: 'manual',
  signal: null
}

authorization url is ready [
  {
    url: URL {
      href: 'https://api.instagram.com/oauth/authorize?scope=user_profile%2Cuser_media&response_type=code&client_id=362485702774061&redirect_uri=https%3A%2F%2Flocal.pyzlo.com%2Fauth%2Fcallback%2Finstagram&code_challenge=vnnZsebt-sSIU9-hcZdExJBPiBHlqJTJ-azJlhgSNgY&code_challenge_method=S256',
      origin: 'https://api.instagram.com',
      protocol: 'https:',
      username: '',
      password: '',
      host: 'api.instagram.com',
      hostname: 'api.instagram.com',
      port: '',
      pathname: '/oauth/authorize',
      search: '?scope=user_profile%2Cuser_media&response_type=code&client_id=362485702774061&redirect_uri=https%3A%2F%2Flocal.pyzlo.com%2Fauth%2Fcallback%2Finstagram&code_challenge=vnnZsebt-sSIU9-hcZdExJBPiBHlqJTJ-azJlhgSNgY&code_challenge_method=S256',
      searchParams: URLSearchParams {
        'scope' => 'user_profile,user_media',
        'response_type' => 'code',
        'client_id' => '362485702774061',
        'redirect_uri' => 'https://local.pyzlo.com/auth/callback/instagram',
        'code_challenge' => 'vnnZsebt-sSIU9-hcZdExJBPiBHlqJTJ-azJlhgSNgY',
        'code_challenge_method' => 'S256' },
      hash: ''
    },
    cookies: [ [Object] ],
    provider: {
      id: 'instagram',
      name: 'Instagram',
      type: 'oauth',
      authorization: [Object],
      token: [Object],
      userinfo: [Object],
      client: [Object],
      profile: [AsyncFunction: profile],
      style: [Object],
      clientId: '362485702774061',
      clientSecret: '2591e0e9df97a0357e332f7517cd2655',
      account: [Function: account],
      signinUrl: 'https://local.pyzlo.com/auth/signin/instagram',
      callbackUrl: 'https://local.pyzlo.com/auth/callback/instagram',
      redirectProxyUrl: undefined,
      checks: [Array]
    }
  }
]
 */