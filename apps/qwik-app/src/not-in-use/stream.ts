import * as Y from "yjs";
import {server$} from "@builder.io/qwik-city";
import {connectStore as connectFakeStore} from "@y-block/gallery";
import generateCatalog from "agent";
import {isServer} from "@builder.io/qwik/build";

async function* arrayToAsyncGenerator<TArray extends Y.Array<any>, T = TArray extends Y.Array<infer T>? T:  never >(yArray: TArray): AsyncGenerator<T> {
    let resolveNewItem: ((value: T[]) => void)  =  console.log;
    let newItemPromise: Promise<T[]>  = new Promise<T[]>((resolve) => {
        resolveNewItem = resolve;
    });

    // Function to create a new promise and store its resolver
    const createNewItemPromise = () => {
        newItemPromise = new Promise<T[]>((resolve) => {
            resolveNewItem = resolve;
        });
    };
    // Observer to watch for changes in the array
    yArray.observe((event) => {
        console.log('event', event);
        event.delta.forEach((op) => {
            console.log('op', op);
            if (op.insert && op.insert instanceof Array) {
                resolveNewItem(op.insert);
                createNewItemPromise();
            }

        });
    });

    // Yield new items as they are pushed into the array
    while (true) {
        const items = await newItemPromise;
        for (const item of items) {
            // console.log('item', item);
            yield item;
        }
    }
}

export const streamFromServer = server$(
    // Async Generator Function
    async function* () {
        console.log('streamFromServer')
        const {catalog} =generateCatalog(new Y.Doc());
        catalog.observe((event) => {
            console.log("catalog:event", catalog.length);
        });
        connectFakeStore(catalog.doc!, "catalog");
        for await (const item of arrayToAsyncGenerator(catalog)) {
            yield item;
        }


    }
);


const genCatalog=   server$(async () => {
    const {page} = connectFakeStore(new Y.Doc(), "catalog");
    const {catalog:ycatalog,start} =  generateCatalog(page.doc!);
    const service = start()
    service.subscribe((state) => {
        console.log('state', `${isServer ? '(server)' : '(client)'}`, state.value);
    })
    service.send({type: "user.login", token: "fake token"})
    ycatalog?.observe((event) => {
        console.log("catalog:event", `${isServer ? '(server)' : '(client)'}`, ycatalog.length);
        // catalog.value = ycatalog.toJSON();
        // store.items = ycatalog.toJSON();
    })
})