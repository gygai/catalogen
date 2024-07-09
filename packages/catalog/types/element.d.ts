import * as Y from 'yjs';
import '@y-block/array';
export declare const ProductCard: import("atomico/types/dom").Atomico<{} & {
    name?: string;
    color?: string;
    href?: string;
    price?: string;
    imageSrc?: string;
    imageAlt?: string;
}, {} & {
    name?: string;
    color?: string;
    href?: string;
    price?: string;
    imageSrc?: string;
    imageAlt?: string;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
export declare const Gallery: import("atomico/types/dom").Atomico<{} & {
    items?: Y.Array<unknown>;
}, {} & {
    items?: Y.Array<unknown>;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
export declare const Props: import("atomico/types/dom").Atomico<{
    bind: string;
} & {
    props?: import("atomico/types/schema").FillObject;
}, {
    bind: string;
} & {
    props?: import("atomico/types/schema").FillObject;
}, {
    new (): HTMLElement;
    prototype: HTMLElement;
}>;
