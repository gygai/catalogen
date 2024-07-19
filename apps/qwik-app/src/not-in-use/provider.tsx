import {
    component$,
    createContextId,
    NoSerialize,
    noSerialize,
    Slot,
    useContextProvider,
    useStore
} from "@builder.io/qwik";
import * as Y from "yjs";
import type {Product} from "@y-block/gallery";
import generateCatalog, {CatalogService} from "agent";
import YProvider from "y-partykit/provider";

export type CatalogStore = {
    catalog: NoSerialize<Y.Array<Product>>;
    service?: NoSerialize<CatalogService> ;
}
export const catalogContext = createContextId<CatalogStore>('catalog');
export default component$(() => {

    useContextProvider(
        catalogContext,
        useStore<CatalogStore>(() => {
            const room = 'catalog'
            const url = "localhost:1999";
            const provider = new YProvider(url, room, new Y.Doc({
                autoLoad: true,
            }), {
                connect: true,
                disableBc: false,
            })

            const {start, actor, catalog} = generateCatalog(provider.doc);
            start();
            return {
                catalog: noSerialize(catalog),
                service: noSerialize(actor)
            } 
        })
    );
 
    return (<Slot />)
})

export const Items = component$(() => {
    // replace this with context retrieval.
    const todos = { items: [] };
    return (
        <ul>
            {todos.items.map((item) => (
                    <li>{item}</li>
                ))}
        </ul>
    );
});
