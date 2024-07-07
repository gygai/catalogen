import {c, css, useEffect, useProp, useRef} from "atomico";
import * as Y from 'yjs';
import '@y-block/array'
import {useProxySlot} from "@atomico/hooks/use-slot";
import type {AtomicoThis} from "atomico/types/dom";
import {useSlot} from "@atomico/hooks";


function gallery() {
    const refSlotTemplate = useRef();
    const Templates = useProxySlot<AtomicoThis>(refSlotTemplate, el => el instanceof HTMLElement) as (AtomicoThis & (new() => any))[];
    const  [ items ]  = useProp("items");
  console.log("g:items", items?.toJSON())
     return (
        <host shadowDom>
            <template>
                <slot ref={refSlotTemplate}/>
            </template>
            <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 max-h-screen">
                <slot name="title"/>
                <y-array array={items}
                         class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {Templates.map((Template, index) =>
                        <y-props>
                            <Template cloneNode/>
                        </y-props>
                    )}
                </y-array>
            </div>
        </host>
    );
}


gallery.props = {
    items: {
        type: Y.Array,
        reflect: false
    }
};

gallery.styles = css`
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
	@tailwind screens;

	:host {
		@apply block  mx-auto;
		display: block;
	}
`;



export const ProductCard =c(function ({name, price, imageSrc, imageAlt, href, color}) {

    return <host shadowDom>
        <div class={"group relative"}>
            <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                <img src={imageSrc} alt={imageAlt}
                     class="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
            </div>

            <div class="mt-4 flex justify-between">
                <div>
                    <h3 class="text-sm text-gray-700">
                        <a href={href}>
                            <span aria-hidden="true" class="absolute inset-0"/>
                            {name}
                        </a>
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">{color}</p>
                </div>
                <p class="text-sm font-medium text-gray-900">{price}</p>
            </div>
        </div>
    </host>
}, {
    styles: css`
		@tailwind base;
		@tailwind components;
		@tailwind utilities;
		@tailwind screens;
    `,

    props: {
        name: String,
        price: String,
        imageSrc: String,
        imageAlt: String,
        href: String,
        color: String

    }
});

export const Gallery = c(gallery);


export const Props = c(function ({props}) {
    const refSlotTemplate = useRef();
    const Templates = useSlot<AtomicoThis>(refSlotTemplate, el => el instanceof Element);

    useEffect(() => {
        console.debug("YProps:reflecting properties", {props})
        Templates.forEach((Template) => {
            Object.assign(Template, props)
        })
    }, [props, Templates])

    return <host shadowDom>
        <slot ref={refSlotTemplate}/>
    </host>

}, {
    props: {
        bind: {
            attr: ":props",
            type: String,
            value: "item",
            reflect: true,
        },
        props: {
            type: Object,
            reflect: false
        }
    }
})
