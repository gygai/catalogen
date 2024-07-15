import { Gallery, GalleryProps, ProductCard, YProps } from "./element";
import { Props } from "atomico";
import { AtomicoThis, JSXElement } from "atomico/types/dom";
import '@y-block/array';
export { Gallery } from "./element";
export * from './fake-store';
export type GalleryElement = AtomicoThis<GalleryProps, typeof Gallery>;
export type ProductCardElement = AtomicoThis<Props<typeof ProductCard>>;
export type PropsElement = AtomicoThis<Props<typeof YProps>>;
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['y-gallery']: JSXElement<typeof Gallery>;
            ['product-card']: JSXElement<typeof ProductCard>;
            ['y-props']: JSXElement<typeof YProps>;
        }
    }
    interface HTMLElementTagNameMap {
        'y-gallery': typeof Gallery;
        'product-card': typeof ProductCard;
        'y-props': typeof YProps;
    }
}
