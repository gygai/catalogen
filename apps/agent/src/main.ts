import * as Y from "yjs";
import createCatalogAgent from "./index.js";
import {createActor, fromPromise, waitFor} from "xstate";
import * as fs from "node:fs"; 
import { tokenService } from "./providers/sap-token.js";
import * as readline from 'node:readline/promises';

import {config} from 'dotenv'; 
config();

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


tokenService.credentialsFromEnv();
 
const {actor, catalog, photos,analysis} = createCatalogAgent(new Y.Doc(), (logic, options) =>createActor(logic.provide({
    actors:{  conifrm: fromPromise(async ()=>     await terminal.question('Confirm? '))}
    }), options));
    
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
 
