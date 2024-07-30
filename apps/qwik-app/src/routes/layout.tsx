import {component$, NoSerialize, noSerialize, Slot, useSignal, useStore, useVisibleTask$} from "@builder.io/qwik";
import {RequestEvent, RequestHandler, routeLoader$, server$} from "@builder.io/qwik-city";
import * as Y from "yjs";
import type {UserPost} from "agent/posts";
import generateCatalog, {CatalogService} from "agent";
import YProvider from "y-partykit/provider";
import type {Product} from "@y-block/gallery";
import {FakeLogin} from "~/components/login";

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
  
  
};

 

export const useProvider = server$(function () { 
        const clientId = this.env.get('AUTH_INSTAGRAM_ID') ;
        const redirectUri = this.env.get('AUTH_INSTAGRAM_REDIRECT_URI') ;
        const clientSecret = this.env.get('AUTH_INSTAGRAM_SECRET')   
        if(!clientId || !clientSecret ||!redirectUri){
            throw new Error('missing instagram configuration' + "\tclientId:" + clientId + "\tredirectUri:" + redirectUri + "\tclientSecret:" + clientSecret);
        }
         
      
      return {
       clientId, clientSecret,
       redirectUri(host:string) {
           return redirectUri.startsWith('http') ? redirectUri : new URL(redirectUri, host).toString();
       }
       
        };
    }
);


export const useAuthorizeUrl = routeLoader$(async({url, request}) => {
  const {clientId, redirectUri, clientSecret} = await useProvider();
  // return  `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${ encodeURIComponent( redirectUri)}&scope=user_profile,user_media&response_type=code`;
     const uriBuilder = new URL('https://api.instagram.com/oauth/authorize');
    uriBuilder.searchParams.set('client_id', clientId);
    uriBuilder.searchParams.set('redirect_uri', redirectUri(url.origin));
    uriBuilder.searchParams.set('scope', 'user_profile,user_media');
    uriBuilder.searchParams.set('response_type', 'code');
  
    return uriBuilder.toString();
})

 


export const ussAccessTokenCookie = routeLoader$(async ({ request, url, params,cookie}) => {
    const currentTimestampInSeconds = Math.floor(Date.now() / 1000); // Current Unix timestamp in seconds
    const {
        access_token,
        expires_at
    } = cookie.get('i-access_token')?.json<{access_token:string, expires_at:number}>() ||{ expires_at: currentTimestampInSeconds, access_token: undefined}; 
     console.log('found token', access_token, expires_at);
    return  access_token
})




export default component$(() => { 
  
  return  <section class="box-border flex relative flex-col shrink-0 p-5 mt-0 min-h-[100px] max-w-[1440px] mx-auto">
  
    <div class="box-border flex relative flex-col shrink-0 pb-0 mt-0 h-auto  "> 
       <Slot />
    </div>
      
  </section>
});
