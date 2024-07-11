import type * as Party from "partykit/server";
import { onConnect, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";
import * as Y from "yjs";
import generateCatalog from "agent";
export default class EditorServer implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  catalog?: Y.Array<any>;
  constructor(public room: Party.Room) {}
  
  async onConnect(conn: Party.Connection) {
    console.log("connected", conn.id, conn.uri, conn.url ?? "");
    return onConnect(conn, this.room, this.getOpts())
  }
   
    getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = { 
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };
    return opts;
  }
 
  handleYDocChange(doc: Doc) {

    this.catalog = this.catalog || connectCatalog(doc)
    function connectCatalog(doc: Doc) {
      const {catalog} =generateCatalog(doc);
        catalog.observe((event) => {
            console.log("catalog:event", catalog.length);
        });
        return catalog;
     }
    
  } 
}
