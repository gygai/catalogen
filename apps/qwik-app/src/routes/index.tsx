import type { DocumentHead } from "@builder.io/qwik-city";

import {component$, NoSerialize, noSerialize, useStore, useVisibleTask$} from '@builder.io/qwik';
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import generateCatalog, {CatalogService} from "agent";
import type {Product} from "agent/catalog";
import Login from "~/components/login";
import {YGallery} from "~/routes/catalog";

                    
export default component$(() => {
    const store = useStore({
        catalog: noSerialize(new Y.Doc().getArray<Product>("catalog")  ),
        service:undefined as NoSerialize<CatalogService> | undefined
    });

    useVisibleTask$(async () => {
        await import ('@y-block/gallery')
        const room = 'catalog'
        const url = "localhost:1999";
        const provider = new YProvider(url, room, new Y.Doc({
            autoLoad: true,
        }), {
            connect: true,
            disableBc: false,
        })
        const {start, actor, catalog} = generateCatalog(provider.doc);
        store.catalog = noSerialize(catalog);
        store.service = noSerialize(actor);
        start();
        return () => {
            provider.disconnect();
        }
    })
    
    return (<>
        <Login q:slot={"nav"} service={store.service}/>
 
          <div class="box-border flex flex-wrap gap-4 mt-5"> 
         {store.catalog && <y-gallery items={store.catalog}>
               <product-card ></product-card>
            </y-gallery>}

        </div>
        </>
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

 
 
