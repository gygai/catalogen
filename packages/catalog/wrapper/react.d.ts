import { Gallery as _Gallery, UserPost as _UserPost } from "@y-block/gallery";
import { Component } from "@atomico/react";
export const Gallery: Component<typeof _Gallery>;
export const UserPost: Component<typeof _UserPost>;
declare namespace JSX {
   interface IntrinsicElements{
      "y-gallery": Component<typeof _Gallery>;,      "user-post": Component<typeof _UserPost>;
   }
}