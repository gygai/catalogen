import type { DocumentHead } from "@builder.io/qwik-city";

import {component$, NoSerialize, noSerialize, useStore, useVisibleTask$} from '@builder.io/qwik';
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import generateCatalog, {CatalogService} from "agent";
import type {Product} from "agent/catalog";
import Login from "~/components/login";
import {type UserPost} from "agent/posts";
import PostsGallery from "~/components/posts";
import {SfButton} from "qwik-storefront-ui";


export default component$(() => {
    const store = useStore({
        posts: noSerialize(new Y.Doc().getArray<UserPost>("photos")  ),
        service:undefined as NoSerialize<CatalogService> | undefined
    });

    useVisibleTask$(async () => {
        await import ('@y-block/gallery')
        const room = 'gin'
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
        return () => {
            provider.disconnect();
        }
    })

    return (<div >
            <div class="box-border  gap-4 mt-"> 
                {store.posts && <y-gallery items={store.posts} >
                    <user-post ></user-post>
                </y-gallery>}
            </div>
           <SfButton onClick$={()=>store.service!.send({
            type: "posts.confirm",
            posts: store.posts, 
           })} >Analyze my preferences</SfButton>
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

 
 
