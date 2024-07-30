import * as Y from "yjs";
import type {BaseRetriever} from "@langchain/core/retrievers";
import {Analysis} from "./analyze.js";
import  { type Product, catalog} from "@y-block/gallery/fake-store/catalog";
 export {type Product} from "@y-block/gallery/fake-store";

function shuffle(array:any[]) {
 return array.toSorted(() => Math.random() - 0.5);
}

const fakeCatalog=catalog()["shoes"]

function exclude(source: any[], exclude: any[]) {
    for (const product of exclude) {
        source = source.filter(({id}) => id !== product.id);
    }
    return source;
}

async function* fakeGetCatalog( {analysis, products, catalog, page}: {analysis: Y.Array<Analysis>, products:BaseRetriever, catalog:Y.Array<Product> , page: number}) {
    console.debug("say i generate catalog based on: ", analysis.toArray());
      
     const randomProducts = shuffle(fakeCatalog).slice(0, page);
     const others=  exclude(fakeCatalog, randomProducts) ;
     const randomProductsGroups = randomProducts.map((product, index) => ({
         product,
         index,
         switches: Array(10).fill(0).map((_, i) => others [Math.floor(Math.random() * others.length)])
     }))

    async function* switching(switches: any[], index: number, product:Product) {
        for (const product of switches) {
            yield {
                ...product,
                index
            }
            await new Promise((resolve) => setTimeout(resolve, 150));
        }
        await new Promise((resolve) => setTimeout(resolve, 150));

        yield {
            ...product,
            index
        }
        await new Promise((resolve) => setTimeout(resolve, 10));

    }

    for  (const {product, switches, index} of randomProductsGroups) {
        yield* switching(switches, index, product);
 

    }
   
}

export default fakeGetCatalog;
