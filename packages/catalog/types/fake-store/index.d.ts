import * as Y from 'yjs';
export { default as fakeCatalog } from './catalog';
export type { Product } from './catalog';
export declare function connectStore(doc: Y.Doc, key?: string, batch?: number): {
    page: Y.Array<unknown>;
    randomChanges: (interval?: number, changes?: number) => Timer;
};
