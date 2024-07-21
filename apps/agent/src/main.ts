import * as Y from "yjs";
import createCatalogAgent from "./index.js";
import {waitFor} from "xstate";
import * as fs from "node:fs";

import {config} from 'dotenv';
config();
 
const {actor, catalog, photos,analysis} = createCatalogAgent(new Y.Doc());
fs.mkdirSync("dist/log", {recursive: true, mode: 0o755});

photos.observe((event) => {
    fs.writeFileSync("dist/log/photos.json", JSON.stringify(photos.toArray(), null, 2));
})

catalog.observe((event) => {
    fs.writeFileSync("dist/log/catalog.json", JSON.stringify(catalog.toArray(), null, 2));
})

analysis.observe((event) => {
    fs.writeFileSync("dist/log/analysis.json", JSON.stringify(analysis.toArray(), null, 2));
})



actor.start();

actor.send({type: "user.login", token: "fake token"});


 waitFor(actor, a=> a.matches("done")).then(() => {
     console.log("done");
        actor.stop();
        process.exit(0);
    });
 
