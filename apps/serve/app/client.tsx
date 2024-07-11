import "./styles.css";
import type {GalleryElement} from "@y-block/gallery";
import YProvider from "y-partykit/provider";
import * as Y from "yjs";
import '@y-block/gallery';
 
 

export function setupCatalog(element: GalleryElement) {
    const url = "localhost:1999";
    const room  = "default";
    const provider= new YProvider(url, room,  new Y.Doc(), {
        connect: true,
        disableBc: false,
    })

    element.items = provider.doc.getArray("catalog");


}


setupCatalog(document.querySelector("#gallery") as GalleryElement);
