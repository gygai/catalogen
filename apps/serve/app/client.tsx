import "./styles.css";
import type {GalleryElement} from "@y-block/gallery";
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import '@y-block/gallery';
import './store';
import './login';
import './analysis';
import type {StoreElement} from "./store";


export function setupCatalog(element: GalleryElement) {
    const store = document.querySelector('y-store') as StoreElement;
    console.log("store", store, store.doc);

    element.items = store.doc?.getArray("catalog");
    store?.addEventListener("load", (e) => {
        console.log("y-store:load", e);
        element.items = store.doc.getArray("catalog");
        console.log("catalog:load", store.doc.getArray("catalog").length);
        element.items .observe(() => {
            console.log("catalog:event", element.items.length);
        })
    })
 
}
 
 

setupCatalog(document.querySelector("#gallery") as GalleryElement);

 