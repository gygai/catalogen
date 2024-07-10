import * as Y from "yjs";
import createCatalogAgent from "./index.js";
import {waitFor} from "xstate";
import * as fs from "node:fs";



const {actor, catalog, photos,analysis} = createCatalogAgent(new Y.Doc());
fs.mkdirSync("dist/log", {recursive: true, mode: 0o755});
catalog.observe((event) => {
    fs.writeFileSync("dist/log/catalog.json", JSON.stringify(catalog.toJSON(), null, 2));
})


 

await waitFor(actor, a=> a.matches("done"));

console.log("=======================================");
console.log( "Catalog", catalog.toJSON());
console.log("=======================================");
console.log( "Photos", photos.toJSON());
console.log("=======================================");
console.log( "Analysis", analysis.toJSON());
console.log("=======================================");