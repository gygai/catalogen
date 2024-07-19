import {component$, NoSerialize, useStore, useTask$} from "@builder.io/qwik";
import * as Y from "yjs";
import type {Product} from "@y-block/gallery";
import {isServer} from "@builder.io/qwik/build";

export interface GalleryProps {  store:{ yCatalog: NoSerialize<Y.Array<Product>>;} }

export const Gallery= component$(function gallery({store}: GalleryProps) {

    const itemsStore = useStore({
        items: [] as Product[],
    });

    useTask$(async ({ track,cleanup }) => {
        console.log('useTask$' , `${isServer ? '(server)' : '(client)'}`);
        track(() => store.yCatalog)
        console.log('store.yCatalog', `${isServer ? '(server)' : '(client)'}`, store.yCatalog?.toJSON());
        store.yCatalog?.observe(async (event) => {
            console.log("catalog:event", `${isServer ? '(server)' : '(client)'}`, itemsStore.items!.length , store.yCatalog!.length);
            for (const {index, item} of store.yCatalog!.toArray().map((item, index) => ({item, index}))) {
                if (!itemsStore.items[index]) {
                    itemsStore.items.push(item);
                }
                if (itemsStore.items[index].id !== item.id) {
                    Object.assign(itemsStore.items[index] , item);
                }
            }
        })
    })
    return        <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 max-h-screen">

        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Catalog</h1>

        <div class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {/*{store.yCatalog!.length === 0 && <div>Loading...</div> || <div>{store.yCatalog!.length}</div>}*/}
            {itemsStore.items!.map((item) => (
                <div key={item.id} class="group relative ease-in-out">

                    <div
                        class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 ease-in-out">
                        <img src={item.image} alt={item.summary}
                             class="h-full w-full object-cover object-center lg:h-full lg:w-full" width={80} height={100}/>
                    </div>
                    <div class="mt-4 flex justify-between">
                        <div>
                            <h3 class="text-sm text-gray-700">
                                <a href={item.image}>
                                    <span aria-hidden="true" class="absolute inset-0"/>
                                    {item.name}
                                </a>
                            </h3>
                            <p class="mt-1 text-sm text-gray-500">{item.spec}</p>
                        </div>
                        <p class="text-sm font-medium text-gray-900">{item.price}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
});



const ProductCard = component$(function productCard(product:Product) {
    return (
        <div key={product.id}
             class="box-border flex relative flex-col shrink-0 gap-4 p-5 mt-0 h-auto rounded-lg cursor-pointer pointer-events-auto bg-neutral-100 max-md:mb-6 w-full sm:w-1/2 md:w-1/3 lg:w-1/5">
            <img
                src={product.image}
                alt={product.title}
                width="314" height="400"
                class="box-border flex overflow-hidden relative flex-col shrink-0 mt-0 w-full min-h-[20px] min-w-[20px] object-contain"
            />
            <div class="box-border flex relative flex-col shrink-0 gap-2">
                <div class="box-border flex relative flex-col shrink-0 mt-0 h-auto leading-[normal] max-md:text-2xl">
                    {product.title}
                </div>
                <div class="box-border flex relative flex-row shrink-0 gap-1 max-md:text-2xl">
                    <div class="box-border flex relative flex-col shrink-0 mt-0 h-auto leading-[normal]">
                        $
                    </div>
                    <div class="box-border flex relative flex-col shrink-0 mt-0 h-auto leading-[normal]">
                        {product.price}
                    </div>
                </div>
            </div>
        </div>
    );
})
export default Gallery;