import {SfButton, SfButtonProps} from "qwik-storefront-ui";
import {component$, Slot} from "@builder.io/qwik";
import {type CatalogStore} from "~/routes/provider";
import {CatalogService} from "agent";
import { useSignIn } from '~/routes/plugin@auth';
import {routeLoader$, server$} from "@builder.io/qwik-city";
import {useAuthorizeUrl} from "~/routes/layout";

export default component$(({store}:{store:{service:CatalogService | undefined}}) => {

 
      return <div class=" block float-right start-3   
          *:mr-4 *:py-2  *:px-4"> <Button
            openLinkInNewTab={false}
            onClick$={() => store.service!.send({type: "user.login", token: "fake token"})}
            disabled={!store?.service}
        >Login</Button>
    <InstagramLogin />
    <InstagramLoginManual />
    </div >
})

export const Button = component$((props:SfButtonProps) => {
    return <SfButton {...props} class="  
           text-violet-900
           rounded-full  border-0
          text-sm font-semibold
          bg-violet-50 
          hover:bg-violet-100"  ><Slot/></SfButton>
});


export const InstagramLogin = component$(() => {
    const signIn = useSignIn();
    return (
        <Button  class="  
           rounded-full  border-0
          text-sm font-semibold
          bg-violet-50 text-violet-700
          hover:bg-violet-100"  onClick$={() => signIn.submit({ providerId: 'instagram', options: { redirectTo: '/posts' } })}>Sign In (authjs)</Button>
    );
});
 

export const InstagramLoginManual = component$(() => {
    
     const authorizeUrl =  useAuthorizeUrl();
      return (
        <Button  class="  
           rounded-full  border-0
          text-sm font-semibold
          bg-violet-50 text-violet-700
          hover:bg-violet-100"    >
            <a href={authorizeUrl.value}>Sign In</a>
           </Button>
    );
});

//https://api.instagram.com/oauth/authorize?scope=user_profile%2Cuser_media&response_type=code&client_id=362485702774061&redirect_uri=https%3A%2F%2Flocal.pyzlo.com%2Fauth%2Fcallback%2Finstagram&code_challenge=YnxuhgfaSBp-KQaz-_S35XIRUO0UIp6eGMncfexoWIQ&code_challenge_method=S256

 
     
     