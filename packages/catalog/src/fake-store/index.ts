import * as Y from 'yjs';
import fakeCatalog  from './catalog';
export  {default  as fakeCatalog}  from './catalog';
export type {Product} from './catalog';



export function connectStore (doc: Y.Doc, key?: string, batch=8) {

    const page = doc.getArray(key || 'catalog');
    const source = doc.getArray('availableItems');
    source.push(fakeCatalog);

    for (const availableItem of source.slice(0, batch)) {
        page.doc.transact(() => {
            page.push([availableItem]);
            source.delete(0, 1);
        })
    }

    return {
        page: page,
        randomChanges: function randomChanges(  interval = 1000) {

            return setInterval(() => {
                //exchange items randomly 
                if (page.length >= batch) {
                    const index = Math.floor(Math.random() * page.length);
                    const length = 1//Math.floor(Math.random() * (target.length - index));
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

