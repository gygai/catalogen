import { Gallery, ProductCard, Props } from "./element";
import { JSXElement } from "atomico/types/dom";
export { Gallery } from "./element";
export * from './fake-store';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['y-gallery']: JSXElement<typeof Gallery>;
            ['product-card']: JSXElement<typeof ProductCard>;
            ['y-props']: JSXElement<typeof Props>;
        }
    }
}
