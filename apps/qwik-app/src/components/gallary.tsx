import {component$, NoSerialize, useSignal, useStore, useTask$} from "@builder.io/qwik";
import * as Y from "yjs";
import type {Product} from "@y-block/gallery";
 import {CatalogService, CatalogState} from "agent";
 
export interface ProductsGalleryProps {
    store: {
        catalog: NoSerialize<Y.Array<Product>>,
        service: NoSerialize<CatalogService> | undefined,
        state: CatalogState
    }
} 

export const ProductsGallery = component$(({store:{state, catalog}}: ProductsGalleryProps) => {
    const popoverRef = useSignal<HTMLElement | undefined>();
 
    return    <div class="box-border  gap-4 mt z-10-" hidden={ state !== "getCatalog" && state !=="done"}>
        {catalog && <y-gallery items={catalog} class="col-start-2">
            <product-card></product-card>
        </y-gallery>}

    </div>
})
export default ProductsGallery;