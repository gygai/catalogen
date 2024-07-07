import { Props as _Props } from "@y-block/gallery/element";
import { Component } from "@atomico/react";
export const Props: Component<typeof _Props>;
declare namespace JSX {
   interface IntrinsicElements{
      "y-props": Component<typeof _Props>;
   }
}