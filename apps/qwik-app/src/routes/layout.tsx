import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";

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

export default component$(() => {
  return  <section class="box-border flex relative flex-col shrink-0 p-5 mt-0 min-h-[100px] max-w-[1440px] mx-auto">
    <div class="box-border flex relative flex-row shrink-0 gap-2 items-center max-sm:flex max-sm:flex-row max-sm:self-stretch max-sm:w-auto">
      <div class="box-border flex relative flex-col shrink-0 mt-0 ml-px h-auto font-light leading-[normal]">
        <h2 class="text-2xl font-semibold"></h2>
      </div>
      <Slot name="nav" />
    </div>
    <div class="box-border flex relative flex-col shrink-0 pb-0 mt-0 h-auto"> 
       <Slot />
    </div>
  </section>
});
