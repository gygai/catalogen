import {component$, Slot} from "@builder.io/qwik";
import {CatalogService, CatalogState} from "agent";
import {Confirm} from "~/components/posts";
import {FakeLogin, InstagramLoginManual} from "~/components/login";
 
export default component$(({store}:{store:{service:CatalogService | undefined, state:CatalogState}}) => {
    return    <div class=" box-border flex sticky top-0 right-0 z-50 flex-row shrink-0 gap-2 items-center max-sm:flex max-sm:flex-row max-sm:self-stretch max-sm:w-auto navbar  ">
        <nav class="max-w-7xl mx-auto flex items-center justify-between bg-gray-300 p-4  4 w-full rounded-full opacity-80">
            <div class="flex items-center">
                <a href="https://mobiri.se">
                    <img src="https://r.mobirisesite.com/574874/assets/images/photo-1603189343302-e603f7add05a.jpeg" alt="Logo" class="w-16 h-16 rounded-full" />
                </a>
                <span class="ml-3 text-2xl font-bold text-gray-700">Chic</span>

            </div>
            <span class="text-lg font-sarif text-gray-500 float-none top-1/2">Unleash your style! Use AI and your photos to personalize your catalog!</span>

            <div class={"flex items-center gap-2  mr-6"}>

                <Slot   />
                <FakeLogin store={store}></FakeLogin>
                <InstagramLoginManual store={store} ></InstagramLoginManual>

                <Confirm store={store!}></Confirm>

            </div>
        </nav>
    </div>
})

