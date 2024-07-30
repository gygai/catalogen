import {Gallery, GalleryProps, ProductCard, YProps} from "./element";
import {AtomicoElement, Props} from "atomico";
import {AtomicoThis, JSXElement} from "atomico/types/dom";
import '@y-block/array'
import {UserPost} from "./post";
export * from './post'
export {Gallery} from "./element";
export * from './fake-store'
customElements.define("y-gallery", Gallery);
customElements.define("y-props", YProps);
customElements.define("product-card", ProductCard);
customElements.define("user-post", UserPost);
export type GalleryElement = AtomicoThis<GalleryProps, typeof Gallery>;
export type ProductCardElement = AtomicoThis<Props<typeof ProductCard>>;
export type PropsElement = AtomicoThis<Props<typeof YProps>>;
 
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['y-gallery']: JSXElement<typeof Gallery>;
            ['product-card']: JSXElement<typeof ProductCard>;
            ['y-props']: JSXElement<typeof YProps>;
            ['user-post']: JSXElement<typeof UserPost>;
        }
    }
    interface HTMLElementTagNameMap {
        'y-gallery': typeof Gallery;
        'product-card': typeof ProductCard;
        'y-props': typeof YProps;
        'user-post': typeof UserPost;
    }
}