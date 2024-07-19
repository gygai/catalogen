import {component$, NoSerialize, noSerialize, Slot, useStore, useVisibleTask$} from "@builder.io/qwik";
import type {RequestEvent, RequestHandler} from "@builder.io/qwik-city";
import * as Y from "yjs";
import type {UserPost} from "agent/posts";
import generateCatalog, {CatalogService} from "agent";
import YProvider from "y-partykit/provider";
import type {Product} from "@y-block/gallery";

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


// export const onGet = async ({ cookie, redirect }: RequestEvent) => {
//
//   const room = 'gin'
//   const url = "localhost:1999";
//   const provider = new YProvider(url, room, new Y.Doc({
//     autoLoad: true,
//   }), {
//     connect: true,
//     disableBc: false,
//   })
//   const {start, actor, catalog, photos, analysis} = generateCatalog(provider.doc);
//   actor.subscribe((state) => {
//     console.debug("state", state.value , {
//       photos: state.context.photos.length,
//       analysis: state.context.analysis.length,
//       catalog: state.context.catalog.length,
//       error: state.context.error
//     })
//     provider.doc.getMap("state").set("currentState", state.value);
//     if(state.value === "posts") {
//       throw redirect(302, '/posts');
//     }
//   });
//   start();
// 
// };



export default component$(() => {

  const store = useStore({
    catalog: noSerialize(new Y.Doc().getArray<Product>("catalog")  ),
    posts: noSerialize(new Y.Doc().getArray<UserPost>("photos")  ),
    analysis: noSerialize(new Y.Doc().getArray<Product>("analysis")  ),
    service:undefined as NoSerialize<CatalogService> | undefined
  });

 
  // useVisibleTask$(async () => {
  //   await import ('@y-block/gallery')
  //   const room = 'gin'
  //   const url = "localhost:1999";
  //   const provider = new YProvider(url, room, new Y.Doc({
  //     autoLoad: true,
  //   }), {
  //     connect: true,
  //     disableBc: false,
  //   })
  //   const {start, actor, catalog, photos, analysis} = generateCatalog(provider.doc);
  //   store.catalog = noSerialize(catalog);
  //   store.posts = noSerialize(photos);
  //   store.analysis = noSerialize(analysis);
  //   store.service = noSerialize(actor);
  //
  //   store.service?.subscribe((state) => {
  //     console.debug("state:", state.value, {
  //       photos: state.context.photos.length,
  //       analysis: state.context.analysis.length,
  //       catalog: state.context.catalog.length,
  //       error: state.context.error
  //     })
  //
  //     if (state.value === "confirm") {
  //      document.location.assign( '/posts')
  //     }
  //
  //   })
  //
  //   start();
  //   return () => {
  //     provider.disconnect();
  //   }
  // })
 

  return  <section class="box-border flex relative flex-col shrink-0 p-5 mt-0 min-h-[100px] max-w-[1440px] mx-auto">
    <div class="box-border flex relative flex-row shrink-0 gap-2 items-center max-sm:flex max-sm:flex-row max-sm:self-stretch max-sm:w-auto">
      <div class="box-border flex relative flex-col shrink-0 mt-0 ml-px h-auto font-light leading-[normal]">
        <h2 class="text-2xl font-semibold"></h2>
      </div>
       <Slot name="nav" class={"box-border flex relative flex-col shrink-0 mt-0 ml-px h-auto font-light leading-[normal] content-end"} />
    </div>
    <div class="box-border flex relative flex-col shrink-0 pb-0 mt-0 h-auto"> 
       <Slot />
    </div>
  </section>
});
