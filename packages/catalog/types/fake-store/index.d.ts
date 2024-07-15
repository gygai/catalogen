import * as Y from 'yjs';
export { products as fakeCatalog } from './catalog';
export type { Product } from './catalog';
export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
declare type IndexedProduct = Record<string, unknown> & {
    id: string;
    priority: number;
};
export declare function connectFakeStore(doc: Y.Doc, key?: string, batch?: number, page?: number): {
    randomChanges: any;
    page: Y.Array<IndexedProduct>;
    items: Y.Array<IndexedProduct>;
};
