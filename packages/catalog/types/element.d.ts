import { Component } from "atomico";
import * as Y from 'yjs';
export interface GalleryProps {
    items: Y.Array<any>;
}
export declare function gallery(): Component<GalleryProps>;
export declare namespace gallery {
    var props: {
        items: {
            type: typeof Y.Array;
            reflect: boolean;
        };
    };
    var styles: import("atomico").Sheet;
}
export declare const ProductCard: import("atomico/types/dom").Atomico<{} & {
    name?: string;
    summary?: string;
    image?: string;
    price?: string;
    href?: string;
    spec?: string;
}, {} & {
    name?: string;
    summary?: string;
    image?: string;
    price?: string;
    href?: string;
    spec?: string;
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
export declare const YProps: import("atomico/types/dom").Atomico<{
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
