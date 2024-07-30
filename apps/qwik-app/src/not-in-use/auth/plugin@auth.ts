import { QwikAuth$ } from "@auth/qwik";
import GitHub from "@auth/qwik/providers/github";
import Instagram from "@auth/qwik/providers/instagram"
import { env } from "node:process";
import {instagramFetchInterceptor} from "~/routes/auth/instagram-fetch.interceptor";
const originalFetch = fetch;
global.fetch = instagramFetchInterceptor(originalFetch);
// const response = await AuthGET(req);
// global.fetch = originalFetch;
//routes/plugin@auth.ts
export const { onRequest, useSession, useSignIn, useSignOut } = QwikAuth$(
  () => ({
        
      debug: true,
      logger: {
          error(code, ...message) {
              console.error(code, message)
          },
          warn(code, ...message) {
              console.warn(code, message)
          },
          debug(code, ...message) {
              console.debug(code, message)
          },
      },
      
      callbacks:{
          session: async ({session, user, token, newSession, trigger}) => {
 
              console.log("session callback",{session, user , token, newSession, trigger});
              
              return {
                  ...session,
                  accessToken: token.accessToken
              };
          }
            
  
      },
    

      providers: [Instagram({
        authorization: 'https://api.instagram.com/oauth/authorize?scope=user_profile,user_media', 
        userinfo: 'https://graph.instagram.com/17841405793187218?fields=id,username',
        token:'https://api.instagram.com/oauth/access_token',
        account(token) {
            console.log("account" , token);
            return {
                service: 'instagram', 
                token: token.access_token,
                ...token

            }
        }
        // token: {
        //     request: async ({code, provider}) => {
        //
        //         const response = await fetch('https://api.instagram.com/oauth/access_token', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/x-www-form-urlencoded',
        //             },
        //             body: new URLSearchParams({
        //                 code,
        //
        //                 ['grant_type']: 'authorization_code',
        //                 ['client_id']: env.INSTAGRAM_CLIENT_ID,
        //                 ['client_secret']: env.INSTAGRAM_CLIENT_SECRET
        //             } as Record<string, string>)
        //         })
        //         const json = await response.json();
        //         console.log(json);
        //         return json;
        //     }
        // }
    })
            
        ],
  }),
);

// export const InstagramLogin = component$(() => {
//     const signIn = useSignIn();
//     return (
//         <Button  class="  
//            rounded-full  border-0
//           text-sm font-semibold
//           bg-violet-50 text-violet-700
//           hover:bg-violet-100"  onClick$={() => signIn.submit({ providerId: 'instagram', options: { redirectTo: '/posts' } })}>Sign In (authjs)</Button>
//     );
// });