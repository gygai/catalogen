'use strict';
import * as Y from "yjs";
import {
    ActorRef,
    assign, createActor,
    EventObject, fromPromise, ActorSystem,
    PromiseSnapshot,
    setup, waitFor
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
    token?: string
}
 
 
type ActorPromise<TInput extends keyof  AgentState> = {    
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
            token: ({   event,
                        context: {token: previous}
                    }) => event.type === "user.login" ? event.token : previous
        })
       
    },
    actors: {
        login: fromPromise(async ({emit})=>{
            for await (const event of fakeLogin()) {
                emit(event)
            }
        }), 
        getUserPhotos: fromPromise(async ({emit, input, signal}: ActorPromise< "token"|"photos">  ) => {
            for await (const event of fakeGetUserPhotos(input )) {
                console.log("event", event);
                if(signal.aborted) return;
                input.photos.push([event])
            }
        }),
        analyzeUserPhotos: fromPromise(async ({emit, input,signal}: ActorPromise<"photos"| "analysis">) => {
            for await (const event of fakeAnalyzePhotos(input )) {
                if(signal.aborted) return; 
                input.analysis.push([event])
            }
        }),
        getCatalog:  fromPromise(async ({emit, input,signal}: ActorPromise<"products"| "analysis" | "catalog">) => {
            for await (const event of fakeGetCatalog(input  )) {
                if(signal.aborted) return;
                input.catalog.push([event])
            }
            
        })
  
}}).createMachine({
    context: ({input: {store, products}}) => ({
        photos: store.getArray<UserPost>("posts"),
        catalog: store.getArray<Product>("catalog"),
        analysis: store.getArray<Analysis>("analysis"),
        products: products,
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
                input: ({ context }) =>({
                    photos: context.photos,
                    token:  context.token!
                }),
                onDone: {
                    target: "analyzeUserPhotos"
                }
            }
             
        },
        analyzeUserPhotos: {
            invoke: {
                src: "analyzeUserPhotos",
                input: ({ context }) => ({
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
                input: ({ context }) => ({
                    products: context.products,
                    catalog: context.catalog,
                    analysis: context.analysis, 
                }),
                onDone: {
                    target: "done"
                }
            } 
        },
        done: {
            type: "final"
        }
    }
} )

export   function catalog(doc: Y.Doc) {

    const actor = createActor(catalogMachine, {
        logger: (msg) => console.debug(msg),
        input: {store: doc, products: {} as BaseRetriever}
    })
    

    actor.subscribe((state) => {
        console.debug("state", state.value);
    });
    
 
    return {
        actor,
        photos: actor.getSnapshot().context.photos,
        catalog: actor.getSnapshot().context.catalog,
        analysis:  actor.getSnapshot().context.analysis,
    };
}
export default catalog;

