import {DocumentHead, RequestHandler, routeLoader$} from "@builder.io/qwik-city";

import {component$, NoSerialize, noSerialize, useStore, useVisibleTask$} from '@builder.io/qwik';
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import generateCatalog, {CatalogService} from "agent";
import type {Product} from "agent/catalog";
import Login, {Button} from "~/components/login";
import {type UserPost} from "agent/posts";
import PostsGallery from "~/components/posts";
 import {getProvider, useTokenUrl} from "~/routes/layout";

export const useAccessToken =   routeLoader$(async ({ request, url, params}):{access_token:string} => {

     const code = url.searchParams.get('code');
    const {clientId, redirectUri, clientSecret} = await getProvider();

    //exchange intagram code for token
    if (code) {
        const url = 'https://api.instagram.com/oauth/access_token'
        const options ={
            method: 'POST',
            redirect: "manual",

            body: new URLSearchParams({
            client_id: '362485702774061',
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: 'https://local.pyzlo.com/posts',
            code: code,
        }),
           headers:{
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'accept': 'application/json',
        }};
        console.log('code',url, options);
        const token = await fetch(url, options).then((res) => res.json());
        console.log('token', token);
        //send token to the auth server
        //return access token to the client
        return token;
    }
    return {
        access_token: 'fake token',
        user: {
            id: 'fake user id',
            username: 'fake username',
        },
    }
})

 

export default component$(() => {
    const store = useStore({
        posts: noSerialize(new Y.Doc().getArray<UserPost>("photos")  ),
        service:undefined as NoSerialize<CatalogService> | undefined
    });
    
    const accessToken = useAccessToken();

    useVisibleTask$(async ({track}) => {
        await import ('@y-block/gallery')
        const room = 'gina'
        const url = "localhost:1999";
        const provider = new YProvider(url, room, new Y.Doc({
            autoLoad: true,
        }), {
            connect: true,
            disableBc: false,
        })
        const {start, actor, catalog, photos, analysis} = generateCatalog(provider.doc);
        store.posts = noSerialize(photos);
        store.service = noSerialize(actor);

        start();
        
        track(()=> accessToken);
        console.log('accessToken', accessToken.value);
        store.service?.send({
            type: "user.login" ,
             token: accessToken.value.access_token
        });
        
        return () => {
            provider.disconnect();
        }
    })

    return (<div >
            <PostsGallery store={store}></PostsGallery> 
        </div>
    );
});




export const head: DocumentHead = {
    title: "Genius Catalog",
    meta: [
        {
            name: "description",
            content: "Genius catalog prototype",
        },
    ],
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