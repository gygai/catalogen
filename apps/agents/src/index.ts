'use strict';
import * as Y from "yjs";
import {
    ActorRef,
    assign, createActor,
    EventObject, fromPromise, ActorSystem,
    PromiseSnapshot,
    setup, waitFor, EventFrom, ActorRefFrom
} from "xstate";
import {type BaseRetriever} from "@langchain/core/retrievers";
import fakeGetUserPhotos, {UserPost} from "./actors/photos.js";
import fakeLogin from "./actors/login.js";
import fakeAnalyzePhotos, {Analysis} from "./actors/analyze.js";
import fakeGetCatalog, {Product} from "./actors/catalog.js";

interface AgentState {
    photos: Y.Array<UserPost>,
    analysis: Y.Array<Analysis>,
    products: BaseRetriever,
    catalog: Y.Array<Product>,
    token?: string,
    page: number
}


type ActorPromise<TInput extends keyof AgentState> = {
    input: Required<Pick<AgentState, TInput>>
    system: ActorSystem<any>;
    self: ActorRef<PromiseSnapshot<void, unknown>, any>;
    signal: AbortSignal;
    emit: (emitted: EventObject) => void;
}
const catalogMachine = setup({
    types: {} as {
        context: AgentState,
        input: { store: Y.Doc, products: BaseRetriever }
    },
    actions: {
        'token.assign': assign({
            token: ({
                        event,
                        context: {token: previous}
                    }) => event.type === "user.login" ? event.token : previous
        })

    },
    actors: {
        login: fromPromise(async ({emit}) => {
            for await (const event of fakeLogin()) {
                emit(event)
            }
        }),
        getUserPhotos: fromPromise(async ({emit, input, signal}: ActorPromise<"token" | "photos">) => {
            for await (const event of fakeGetUserPhotos(input)) {
                console.log("event", event);
                if (signal.aborted) return;
                input.photos.push([event])
            }
        }),
        analyzeUserPhotos: fromPromise(async ({emit, input, signal}: ActorPromise<"photos" | "analysis">) => {
            for await (const event of fakeAnalyzePhotos(input)) {
                if (signal.aborted) return;
                input.analysis.push([event])
            }
        }),
        getCatalog: fromPromise(async ({
                                           emit,
                                           input,
                                           signal
                                       }: ActorPromise<"products" | "analysis" | "catalog" | "page">) => {
            for await (const {index, ...product} of fakeGetCatalog(input)) {
                console.log("getCatalog:event", `to: ${index}`, product);
                if (signal.aborted) return;
                const deletedItems = input.catalog.slice(index, index + 1);

                input.catalog.doc!.transact(() => {
                    // input.catalog.length > index && input.catalog.delete(index, 1); 
                    input.catalog.insert(index, [product]);
                    // input.catalog.insert(index, deletedItems);
                })
            }

        })

    }
}).createMachine({
    context: ({input: {store, products}}) => ({
        photos: store.getArray<UserPost>("posts"),
        catalog: store.getArray<Product>("catalog"),
        analysis: store.getArray<Analysis>("analysis"),
        products: products,
        page: 12,
        token: undefined
    }),

    initial: 'idle',
    states: {
        idle: {
            invoke: {
                src: "login"
            },
            on: {
                'user.login': {
                    actions: ['token.assign'],
                    target: "getUserPhotos"
                }
            }
        },
        getUserPhotos: {
            invoke: {
                src: "getUserPhotos",
                input: ({context}) => ({
                    photos: context.photos,
                    token: context.token!
                }),
                onDone: {
                    target: "analyzeUserPhotos"
                }
            }

        },
        analyzeUserPhotos: {
            invoke: {
                src: "analyzeUserPhotos",
                input: ({context}) => ({
                    analysis: context.analysis,
                    photos: context.photos
                }),
                onDone: {
                    target: "getCatalog"
                }
            }
        },
        getCatalog: {
            invoke: {
                src: "getCatalog",
                input: ({context}) => ({
                    photos: context.photos,
                    products: context.products,
                    catalog: context.catalog,
                    analysis: context.analysis,
                    page: context.page
                }),
                onDone: {
                    target: "done"
                }
            }
        },
        done: {
            on: {
                'user.login': {
                    actions: ['token.assign'],
                    target: "getUserPhotos"
                },
                'generate': 'getCatalog'
            }
        }
    }
})

export function catalog(doc: Y.Doc) {

    const actor = createActor(catalogMachine, {
        logger: (msg) => console.debug(msg),
        input: {store: doc, products: {} as BaseRetriever}
    })



    actor.subscribe((state) => {
        console.debug("state", state.value);
    });


    return {
        actor,
        start: () => actor.start(),
        photos: actor.getSnapshot().context.photos,
        catalog: actor.getSnapshot().context.catalog,
        analysis: actor.getSnapshot().context.analysis,
    };
}


export class CatalogGenerator implements AgentState {
    photos: Y.Array<UserPost>;
    analysis: Y.Array<Analysis>;
    products: BaseRetriever<Record<string, any>>;
    catalog: Y.Array<Product>;
    token?: string | undefined;
    page: number;
    actor: ActorRefFrom<typeof catalogMachine>

    constructor(public doc: Y.Doc = new Y.Doc({
        guid: "ctlg-" + Math.random().toString(36).slice(2, 8), 
        autoLoad:true,
        collectionid: "catalog"
    }), autoStart:boolean=false) {
        const {actor, catalog: ycatalog, photos, analysis} = catalog(doc);
        this.photos = photos;
        this.analysis = analysis;
        this.catalog = ycatalog;
        this.products = {} as BaseRetriever<Record<string, any>>;
        this.page = 12;
        this.token = undefined;
        this.actor = actor;
        autoStart && this.start();

    }

    start() {
        return this.actor.start();
    }

    stop() {
        return this.actor.stop();
    }

    login(token: string) {
        this.actor.send({type: "user.login", token});
    }

    async send(event: EventFrom<typeof catalogMachine>) {
        this.actor.send(event);

    }

    async waitForDone() {
        return waitFor(this.actor, a => a.matches("done"));
    }
    
     connect(doc: Y.Doc) {
         this.doc.on("update", (update) => {
                console.log("doc:update", update);
                Y.applyUpdate(doc, update);
          });
     }


}

export default catalog;

/*

    doc.getArray<EventFrom<typeof catalogMachine>>("events")
        .observe((event) => {
            console.log("events", event);
            actor
                .send(event.delta.filter((e) => e.insert instanceof Array)[0]
                    .insert as EventObject)
        })
 */