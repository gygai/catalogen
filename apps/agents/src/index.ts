'use strict';
import * as Y from "yjs";
import {
    ActorRef,
    assign,
    createActor,
    EventObject,
    fromPromise,
    ActorSystem,
    PromiseSnapshot,
    setup,
    ErrorActorEvent,
    Observer, InspectionEvent, StateValue, ActorRefFrom
} from "xstate";
import {type BaseRetriever} from "@langchain/core/retrievers";
import fakeGetUserPhotos, {UserPost} from "./actors/photos.js";
import fakeLogin from "./actors/login.js";
import {fakeAnalyzePhotos,Analysis} from "./actors/analyze.js";
import fakeGetCatalog, {Product} from "./actors/catalog.js";
 
interface AgentState {
    photos: Y.Array<UserPost>,
    analysis: Y.Array<Analysis>,
    products: BaseRetriever,
    catalog: Y.Array<Product>,
    error?: unknown;

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

const assignError= assign({
    error: ( {event}:{event:ErrorActorEvent}) => event.error
});

const errorTransition= {
    target: "error",
    actions: [assignError]
} as any

const catalogMachineSetup = setup({
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
                input.photos.doc!.transact(() => {
                    input.photos.length > 20 && input.photos.delete(20, input.photos.length - 20);
                    input.photos.insert( 0,[event]);
                })            }
        }),

        analyzeUserPhotos: fromPromise(async ({emit, input, signal}: ActorPromise<"photos" | "analysis">) => {
            for await (const analysis of fakeAnalyzePhotos(input)) {
                if (signal.aborted) return ;
                input.analysis.doc!.transact(() => {
                    input.analysis.length > 20 && input.analysis.delete(20, input.analysis.length - 20);
                    input.analysis.insert( 0,[analysis]);
                })
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
                    input.catalog.length > 20 && input.catalog.delete(100, input.catalog.length - 100);

                    input.catalog.length > index && input.catalog.delete(index, 1); 
                    input.catalog.insert(index, [product]);
                    // input.catalog.insert(index, deletedItems);
                })
            }

        })

    }
})
 


const catalogMachine = catalogMachineSetup.createMachine({
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
                    target: "confirm"
                },
                onError: errorTransition
            }

        },
        confirm: { 
            on: {
                'posts.confirm': 'getCatalog'
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
                },
                onError: {
                    target: "getCatalog",
                    actions: assign({
                        error: ( {event}:{event:ErrorActorEvent}) => event.error
                    })
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
                },
                onError: errorTransition

            }
        },
        error: {
             on: {
                'user.login': {
                    actions: ['token.assign'],
                    target: "getUserPhotos"
                },
                'generate': 'getCatalog'
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

     const logger:Observer<InspectionEvent> = {
            next: (value:InspectionEvent) =>  console.debug("inspect",  {
                event: value.type,
                root: value.rootId,
                actorRef: value.actorRef.id,
               
            }),
            error: (err:unknown) => console.error("inspect:error", err),
            complete: () => console.debug("inspect:complete")
        }
        
    const ystate =doc.getMap("state");
    const savedState = ystate.get ('currentState');
   const restoredState =  catalogMachine.resolveState({
        value: savedState as StateValue || "idle" ,
        context: {
            photos: doc.getArray<UserPost>("posts"),
            catalog: doc.getArray<Product>("catalog"),
            analysis: doc.getArray<Analysis>("analysis"),
            products: {} as BaseRetriever,
            page: 12,
            token: doc.getText("token")?.toJSON()
        }
    })
    const actor = createActor(catalogMachine, {
        snapshot: restoredState,
        logger: (msg) => console.debug(msg),
        inspect: logger,
        input: {store: doc, products: {} as BaseRetriever}
    })



    actor.subscribe((state) => {
        console.debug("state", state.value , {
            photos: state.context.photos.length,
            analysis: state.context.analysis.length,
            catalog: state.context.catalog.length,
            error: state.context.error
            })
        
        ystate.set("currentState", state.value);
        
        
    });


    return {
        actor,
        start: () => actor.start(),
        photos: actor.getSnapshot().context.photos,
        catalog: actor.getSnapshot().context.catalog,
        analysis: actor.getSnapshot().context.analysis,
    };
}

export type CatalogService = ActorRefFrom<typeof catalogMachine>


export default catalog;

/*

    doc.getArray<EventFrom<typeof catalogMachine>>("events")
        .observe((event) => {
            console.log("events", event);
            actor
                .send(event.delta.filter((e) => e.insert instanceof Array)[0]
                    .insert as EventObject)
        })
        
                confirmPhotos: fromPromise(async ({emit, input, signal}: ActorPromise<"confirm">) => {
            return new Promise<void>((resolve) => {
                input.confirm.observe((event) => {
                    if (event.keysChanged.has("confirm")) {
                        console.log("confirmPhotos:event", event.keysChanged.has("confirm"));
                        resolve();
                    }
                })
            })
        }),
 */