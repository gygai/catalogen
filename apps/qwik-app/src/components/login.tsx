import {SfButton, SfButtonProps} from "qwik-storefront-ui";
import {component$, Slot} from "@builder.io/qwik";
import {type CatalogStore} from "~/routes/provider";
import {CatalogService} from "agent";
import { useSignIn } from '~/routes/plugin@auth';

export default component$(({store}:{store:{service:CatalogService | undefined}}) => {

 
      return <div class=" block float-right start-3   
          *:mr-4 *:py-2  *:px-4"> <Button
            openLinkInNewTab={false}
            onClick$={() => store.service!.send({type: "user.login", token: "fake token"})}
            disabled={!store?.service}
        >Login</Button>
    
    <InstagramLogin />
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
          hover:bg-violet-100"  onClick$={() => signIn.submit({ providerId: 'instagram', options: { redirectTo: '/posts' } })}>Sign In</Button>
    );
});