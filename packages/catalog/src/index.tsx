import {Gallery, ProductCard, Props} from "./element";
import {AtomicoElement} from "atomico";
import {JSXElement} from "atomico/types/dom";

export {Gallery} from "./element";
export * from './fake-store'
customElements.define("y-gallery", Gallery);
customElements.define("y-props", Props);
customElements.define("product-card", ProductCard);
declare global {
    namespace JSX {
        interface IntrinsicElements {
            ['y-gallery']: JSXElement<typeof Gallery>;
            ['product-card']:  JSXElement<typeof ProductCard>
            ['y-props']:  JSXElement<typeof Props>
        }
    }

}