import data from './data.json';
export declare const products: ({
    id: number;
    category: string;
    name: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
    price: string;
    color: string;
} | {
    id: number;
    name: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
    price: string;
    color: string;
    category?: undefined;
})[];
export type Product = typeof data[0];
declare const _default: Product[];
export default _default;
