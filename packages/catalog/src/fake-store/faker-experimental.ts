import * as Y from "yjs";
import {fakeCatalog} from "./index";

export function connectFakeStore (doc: Y.Doc, key?: string, batch=8,  page:number=0) {

    const items = doc.getArray<string>(':catalog:all');


    function setAll<TMap extends Y.Map<any> >(item:object, map:TMap) {
        Object.entries(item).forEach(([key, value]) => {
            map.set(key, value);
        })
        return map;
    }

    const randomPriority = ()=> Math.floor(Math.random() * Math.min(fakeCatalog.length, batch));

    for (let i = 0; i <fakeCatalog.length ; i++) {
        const id =  Math.floor(Math.random() * 10000000000000000).toString(16);
        const product = setAll({
            ...fakeCatalog[i],
            ':id': id,
            ':priority': i
        }, getProduct(doc, id));

        // items.insert(i, [id.toString()]);

        syncProduct(product, items);

        //syncPriority(product, id);
    }
    //

    const pageItems = doc.getArray<IndexedProduct>(key || ':catalog:page:items');
    pageItems.push( items.slice(0, batch).map((id) => getProduct(doc, id).toJSON() as IndexedProduct) );

    // const map =doc.getMap(`:catalog:priority:${page}`)
    // map.observe((event) => {
    //     console.log('priority', event);
    //     pageItems.doc.transact(() => {
    //         pageItems.delete(0, pageItems.length);
    //         pageItems.push(Array.from(map.entries()).slice(0, batch).map(([id, product]) => product.toJSON() as Product) );
    //     })
    // })



    // const pageArray = doc.getArray<string>(  ':catalog:page');
    // pageArray.push( items.slice(0, batch) );
    // pageArray.observe((event) => {
    //     console.log('page', event);
    //     pageItems.doc.transact(() => {
    //         pageItems.delete(0, pageItems.length);
    //         pageItems.push(pageArray.map((id) => getProduct(doc, id).toJSON() as Product) );
    //     })
    // })
    // items.observe((event) => {
    //     console.log('items', event);
    //        pageArray.doc.transact(() => {
    //             pageArray.delete(0, pageArray.length);
    //             pageArray.push(items.slice(0, batch));
    //         }) 
    // })

    function randomIndexChange(items:Y.Array<any>, interval= 1000) {
        return setInterval(() => {
            const index = Math.floor(Math.random() * items.length);
            const length = 1//Math.floor(Math.random() * (target.length - index));

            console.log('randomIndexChange', index, items.length);
            const item=items.get(index);
            const deletedItems = items.slice(index, index + length);

            items.doc.transact(() => {
                items.insert(0, deletedItems);
                items.delete(index, length);
            })


        }, interval)
    }





    return {
        // randomChanges: randomPriorityChanges.bind(null, items, randomPriority),
        // randomChanges: randomChanges.bind(null, page,  items.clone(), batch),
        randomChanges: randomIndexChange.bind(null, items),
        page:pageItems,
        items:pageItems
    };

}

function syncProduct(product: Y.Map<any>, items: Y.Array<any>) {
    const getPriority = () => product.get(':priority') as number | undefined;

    items.insert(getPriority(), [product.get(':id')]);

    product.observe((ymapEvent) => {
        if (ymapEvent.changes.keys.has(':priority')) {
            const oldValue = ymapEvent.changes.keys.get(':priority').oldValue;
            product.doc.transact(() => {
                oldValue && items.delete(oldValue, 1);
                items.insert(getPriority(), [product.get(':id')]);
                items.slice(getPriority() +1).forEach((id) => {
                    const product = getProduct(items.doc, id);
                    product?.set(':priority', product?.get(':priority') as number + 1);
                })
            })
        }
    })
}
function syncPriority(product: Y.Map<any> ,id:string, pKey = ':priority') {
    const getPriority = () => product.get(pKey) as number | undefined;
    const getPriorityList = (priority:number ) =>  product.doc.getMap(`:catalog:priority:${priority}`);
    const getOldPriority = (map: Y.YMapEvent<any>) => map.changes.keys.get(pKey).oldValue
    function updateMap(newList: Y.Map<any>, oldList?: Y.Map<any>) {
        // product.doc.transact(() => {

        oldList?.has(id) && oldList.delete(product.get(id));
        newList.set(product.get(id), product.clone());
        // })
    }

    function update(newList: Y.Array<any>, oldList?: Y.Array<any>) {
        product.doc.transact(() => {
            oldList && oldList.delete( oldList.toArray().indexOf(product), 1);
            newList.insert(0,  [product]);
        })
    }


    product.observe((ymapEvent) => {
        if (ymapEvent.changes.keys.has(pKey)) {
            updateMap(getPriorityList(getPriority()), getPriorityList(getOldPriority(ymapEvent)));
        }
    })

    updateMap(getPriorityList(getPriority()));
}
function randomPriorityChanges(items: Y.Array<string>, randomPriority?: () => number  ) {
    randomPriority = randomPriority || (() => Math.floor(Math.random() * items.length));
    return setInterval(() => {
        const index = randomPriority();
        console.log('randomPriorityChanges', {
            index,
            id:items.get(index),
            items:items.toJSON(),
            id2:items.get(index)});



        const product = getProduct(items.doc, items.get(index)!|| "")
        product?.set(':priority', randomPriority());

        console.log('randomPriorityChanges:after', {
            index,
            id:items.get(index),
            items:items.toJSON(),
            product: product?.toJSON(),
            priority: product?.get(':priority')
        });

    }, 2000);


}
function getProduct(doc: Y.Doc, id: string) {
    return doc.getMap(`:catalog:product:${id.toString()}`);
}

/*@types*/
export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

declare type IndexedProduct = Record<string, unknown> &{
    id: string;
    priority: number;
};

type Values<T> = Entries<T>[1];



type ProductMap = Iterable<Entries<IndexedProduct>>
type ProductValue = Values<ProductMap>
