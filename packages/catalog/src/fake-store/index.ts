import * as Y from 'yjs';
import fakeCatalog  from './catalog';
export  {default  as fakeCatalog}  from './catalog';
export type {Product} from './catalog';


function paging(source: Y.Array<unknown>, batch: number, page: Y.Array<unknown>) {
    for (const availableItem of source.slice(0, batch)) {
        page.doc.transact(() => {
            page.push([availableItem]);
            source.delete(0, 1);
        })
    }

    return {
        page: page,
        randomChanges: 
            //exchange items randomly between source and the page
            function randomChanges(interval:number = 1000, changes:number =1) {

            return setInterval(() => {
                if (page.length >= batch) {
                    const index = Math.floor(Math.random() * page.length);
                    const length = changes//Math.floor(Math.random() * (target.length - index));
                    const deletedItems = page.slice(index, index + length);
                    page.doc.transact(() => {
                        page.delete(index, length);
                        page.insert(index, source.slice(index, index + length));
                        source.delete(index, length);
                        source.insert(index, deletedItems);
                    });

                    // console.log('exchangeItems', {
                    //     source: source.toJSON(),
                    //     target: target.toJSON(),
                    //     index,
                    //     length
                    //  });

                }

            }, interval)
        }
    }
}

export function connectStore (doc: Y.Doc, key?: string, batch=8) {

    const page = doc.getArray(key || 'catalog');
    const source = doc.getArray('availableItems');
    source.push(fakeCatalog);
    return paging(source, batch, page);


}

