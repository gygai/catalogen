import { Gallery as _Gallery } from "@y-block/gallery";
import { Component } from "@atomico/react/preact";
export const Gallery: Component<typeof _Gallery>;
declare namespace JSX {
   interface IntrinsicElements{
      "y-gallery": Component<typeof _Gallery>;
   }
}