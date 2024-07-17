import {SfButton} from "qwik-storefront-ui";
import {component$} from "@builder.io/qwik";
import {type CatalogStore} from "~/routes/provider";
import {CatalogService} from "agent";

export default component$(({service}:{service:CatalogService | undefined}) => {
 
    return <div>
        {service ? (<SfButton
            text="Login"
            class="box-border flex relative flex-col shrink-0 self-center px-4 py-2 mt-0 w-auto text-center text-blue-600 rounded appearance-none cursor-pointer max-sm:mr-auto"
            openLinkInNewTab={false}
            onClick$={() => service.send({type: "user.login", token: "fake token"})}
        >Login</SfButton>) : (<SfButton
            text="Login"
            class="box-border flex relative flex-col shrink-0 self-center px-4 py-2 mt-0 w-auto text-center text-blue-600 rounded appearance-none cursor-pointer max-sm:mr-auto"
            openLinkInNewTab={false}
            disabled={true}
        >Login</SfButton>)
    }
    </div>
})
    