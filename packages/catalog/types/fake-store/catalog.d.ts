import data from './data.json';
export type Product = typeof data[0];
declare const _default: Product[];
export default _default;
export declare function catalog(): Record<Product["categories"], Product[]>;
