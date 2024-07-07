import * as Y from 'yjs';
import fakeCatalog  from './catalog';
export function connectFakeStore (doc: Y.Doc, key?: string) {

    const items = doc.getArray(key || 'items');
    const availableItems = doc.getArray('availableItems');
    availableItems.push(fakeCatalog); 
    
    for (const availableItem of availableItems.slice(0, 8)) {
        items.doc.transact(() => {
            items.push([availableItem]);
            availableItems.delete(0, 1);
        })
    }
    
    randomChanges(items, availableItems);
    
    return items;

}

function randomChanges (target: Y.Array<any>, source:  Y.Array<any>, max=8 ) {

    setInterval(() => {
        //exchange items randomly 
        if (target.length >= max) {
            const index= Math.floor(Math.random() * target.length);
            const length = 1//Math.floor(Math.random() * (target.length - index));
            const deletedItems = target.slice(index, index + length);
            target.doc.transact(() => {
                target.delete(index, length);
                target.insert(index, source.slice(index, index + length));
                source.delete(index, length);
                source.insert(index, deletedItems);
            });
             
            console.log('exchangeItems', {
                source: source.toJSON(),
                target: target.toJSON(),
                index,
                length
             });
        
        }

    }, 2000)
}