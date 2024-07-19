import type {DocumentHead} from "@builder.io/qwik-city";

import {component$, NoSerialize, noSerialize, useSignal, useStore, useTask$, useVisibleTask$} from '@builder.io/qwik';
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import generateCatalog, {CatalogService} from "agent";
import type {Product} from "agent/catalog";
import Login, {Button} from "~/components/login";
import {type UserPost} from "agent/posts";
import PostsGallery from "~/components/posts";

export const Upload = component$(() => {
    return <label class="block">
        <span class="sr-only">Choose profile photo</span>
        <input type="file" class="block w-full text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-0
      file:text-sm file:font-semibold
      file:bg-violet-50 file:text-violet-700
      hover:file:bg-violet-100
    "/>
    </label>
})

export default component$(() => {
    const store = useStore({
        catalog: noSerialize(new Y.Doc().getArray<Product>("catalog")),
        posts: noSerialize(new Y.Doc().getArray<UserPost>("photos")),
        analysis: noSerialize(new Y.Doc().getArray<Product>("analysis")),
        service: undefined as NoSerialize<CatalogService> | undefined,
        state: "idle" as "error" | "done" | "getUserPhotos" | "analyzeUserPhotos" | "getCatalog" | "idle" | "confirm"
    });

    const serviceState = useSignal(store.state);

    useVisibleTask$(async () => {
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
        store.catalog = noSerialize(catalog);
        store.posts = noSerialize(photos);
        store.analysis = noSerialize(analysis);
        store.service = noSerialize(actor);
        actor.subscribe((state) => {
            console.debug("state:i", state.value, {
                photos: state.context.photos.length,
                analysis: state.context.analysis.length,
                catalog: state.context.catalog.length,
                error: state.context.error
            })

            serviceState.value = state.value;

        })
        start();
        return () => {
            provider.disconnect();
        }
    })

    return (<div>
            <Login q:slot={"nav"} store={store}/>
            <div class="box-border  gap-4 mt z-10-">
                {serviceState.value}
                {store.catalog && <y-gallery items={store.catalog} class="col-start-2">
                    <product-card></product-card>
                </y-gallery>}

            </div>
            <PostsGallery store={store}></PostsGallery>


            {/*{serviceState.value === "confirm" &&*/}
            {/*    <PostsGallery store={store}  ></PostsGallery>*/}
            {/*}*/}
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

 
 
