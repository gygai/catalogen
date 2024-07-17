import type * as Party from "partykit/server";
import { onConnect, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";
import * as Y from "yjs";
import {YPartyKitStorage} from "y-partykit/storage";
import { SINGLETON_ROOM_ID } from "./rooms";
import { env } from "node:process";



export default class DocServer implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  catalog?:  Y.Array<any>
  constructor(readonly  room: Party.Room) {}
  
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
      console.log(
          `Connected:
                  id: ${conn.id}
                  room: ${this.room.id}
                  url: ${new URL(ctx.request.url).pathname}                  `
          
      );
      
      for (const [key, value] of Object.entries(this.room.env)) {
          if (typeof value === "string") {
              env[key] = value;
          }
        }
      
      await this.updateCount();

      return onConnect(conn, this.room, this.getOpts())
  }

    getOpts() {
        // options must match when calling unstable_getYDoc and onConnect
        const opts: YPartyKitOptions = {
            callback: { handler: (doc) => this.handleYDocChange(doc), 
            
            },
            persist: {
                mode: "snapshot"
            },
            load: async () => {
                // console.log("load",this.service.doc.guid, this.room.id, this.room.storage)
              // return this.service.doc
                const roomStorage = new YPartyKitStorage(this.room.storage);
                const ydoc = await roomStorage.getYDoc(this.room.id);
                
                return ydoc;
            }
        };
        
        return opts;
    }

    async updateCount() {
        // Count the number of live connections
        const count = [...this.room.getConnections()].length;
        // Send the count to the 'rooms' party using HTTP POST
        await this.room.context.parties.rooms.get(SINGLETON_ROOM_ID).fetch({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room: this.room.id, count }),
        });
    }


   async onStart(){
         for (const [key, value] of Object.entries(this.room.env)) {
           if (typeof value === "string") {
               env[key] = value;
           }
       }


   }
 
 
  handleYDocChange(doc: Doc) {
      console.log('handleYDocChange: ' ,
          doc.guid,
          doc.collectionid,
          doc.getArray("catalog").length)

  }


    async onMessage(message: string, sender: Party.Connection) {
        // let's log the message
        console.log(`connection ${sender.id} sent message: ${message} `);
        this.room.broadcast(message, [sender.id]);
    
    }

    async onRequest(req: Party.Request) {
        const roomStorage = new YPartyKitStorage(this.room.storage);
        const ydoc = await roomStorage.getYDoc(this.room.id);
  
        /*debug any content /party/{}
          examples:
           /party/catalog
           /party/analysis
           /party/photos 
           /party/state
        */
        if(req.method === "GET"  ) {
            const slug = req.url.split("/").pop()!;
            const state = ydoc.get(slug).toJSON();
            return Response.json(state.toJSON())
        }
        
        return new Response("Unsupported method", { status: 400 });
    }
 
}

 
