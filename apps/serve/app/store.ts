import * as Y from "yjs";
import YProvider from "y-partykit/provider";

export class StoreElement extends HTMLElement {

    doc:Y.Doc;
    provider: YProvider;

    static observedAttributes = ["url", "room"];

    get url() {
        return this.getAttribute("url") || document.location.host;
    }
    get room() {
        return this.getAttribute("room") || "catalog";
    }
    constructor() {
        super();
        const {provider, doc} =this.connect();
        this.doc = doc ;
        this.provider = provider;
        console.log("store:constructor ",this.url, this.room, "\tconnected:", this.provider.wsconnected , "\tdoc:loaded", this.doc.isLoaded, "\tdoc:synced", this.doc.isSynced);

    }

    connectedCallback() {
        console.log("store:connected", this.url, this.room, "\tconnected:", this.provider.wsconnected , "\tdoc:loaded", this.doc.isLoaded, "\tdoc:synced", this.doc.isSynced);
        this.provider.connect();
        this.provider.on("wsconnected", () => {
            console.log("store:wsconnected", this.url, this.room, "\tconnected:", this.provider.wsconnected , "\tdoc:loaded", this.doc.isLoaded, "\tdoc:synced", this.doc.isSynced);
        })
        this.dispatchEvent(new Event("load"));
    }


    attributeChangedCallback(name:string, oldValue:any, newValue:any) {
        console.log(
            `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
        );
        if(name === "room" || name === "url" && oldValue !== newValue) {
            const {provider, doc} =this.connect();
            this.doc = doc;
            this.provider = provider;
        }
    }



    private connect() {
        const url = this.getAttribute("url") || document.location.origin;
        const room = this.getAttribute("room") || "catalog";
        const provider = new YProvider(url, room, new Y.Doc({
            autoLoad: true,
        }), {
            connect: false,
            disableBc: false,
        })
        const doc = provider.doc;
        console.log("connect ",url, room, "\tconnected:", provider.wsconnected , "\tdoc:loaded", doc.isLoaded, "\tdoc:synced", doc.isSynced);

        return {provider: provider, doc: doc};
    }
}

customElements.define("y-store", StoreElement);

declare global {
    interface HTMLElementTagNameMap {
        "y-store": StoreElement;
    }
}