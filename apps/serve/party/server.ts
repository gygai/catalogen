import type * as Party from "partykit/server";
import { onConnect, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";
import { SINGLETON_ROOM_ID } from "./rooms";
import {type ActorRef, type ActorRefFrom, createActor} from "xstate";
import machine from "./agents/simple";

export default class EditorServer implements Party.Server {
  yjsOptions: YPartyKitOptions = {};
  // actor: ActorRefFrom<typeof machine>;
  constructor(public room: Party.Room) {
    // this.actor=  createActor(machine, {
    //   logger: (msg) => console.log(msg),
    // }).start();
  }

   
    getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = {
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };
    return opts;
  }

  async onConnect(conn: Party.Connection) {
    await this.updateCount();

    // this.actor.subscribe((state) => {
    //    console.log("state", state);
    //     conn.send(JSON.stringify({type: "thought", thought: state.context.thought}));
    //    
    // });
    return onConnect(conn, this.room, this.getOpts());
    
  }

  async onClose(_: Party.Connection) {
    await this.updateCount();
  }

  handleYDocChange(_: Doc) {
    //console.log("ydoc changed");
    // called on every ydoc change
    // no-op
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
}
