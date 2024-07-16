import {c, css, useEffect, useProp, useRef, Component} from "atomico";
import * as Y from 'yjs';
import {useProxySlot} from "@atomico/hooks/use-slot";
import type {AtomicoThis} from "atomico/types/dom";
import {useSlot} from "@atomico/hooks";


export interface GalleryProps{
    items: Y.Array<any>;
}
 
export function gallery():Component<GalleryProps> {
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
                         class="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 ">
                    {Templates.map((Template, index) =>
                        <y-props key={"index"}>
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



export const ProductCard =c(function ({name, price, image, summary, href, spec}) {

    return <host shadowDom>
        <div class={"group relative ease-in-out duration-300  h-96 overflow-y-hidden rounded-lg"}>
            <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 transition-all ">
                <img src={image} alt={summary} 
                     class="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
            </div>

            <div class="mt-4 flex justify-between  ">
                <div  class="w-9/12">
                    <h3 class="text-sm text-gray-700 overflow-ellipsis h-full overflow-y-hidden	z-9 overflow-x-hidden text-pretty ">
                        <span aria-hidden="true" class="absolute inset-0 overflow-ellipsis" />
                        {name} 
                    </h3>
                    {spec?.split(" ")?.map(x=>x.split(':')?.[1]?.replaceAll('\'', ''))?.map((item, index) =>
                        <p key={index} class="mt-1 text-sm text-gray-500  float-left absolute bg-auto backdrop-blur-2xl rounded-3xl z-10">{item}</p>)
                    }
                </div>
                <p class="text-sm font-medium text-gray-900 start-full">{price}</p>
            </div>
        </div>
    </host>
}, {
    styles: css`
		@tailwind base;
		@tailwind components;
		@tailwind utilities;
		@tailwind screens;
        
        :host {
            @apply block;
            display: inline-block;
        }
    `,

    props: {
        name: {
            type: String,
            reflect: true
        },
        price: {
            type: String,
            reflect: true
        },
        image: {
            type: String,
            reflect: true
        },
        summary: {
            type: String,
            reflect: true
        },
        href: {
            type: String,
            reflect: true
        },
        spec: {
            type: String,
            reflect: true
        }

    }
});

export const Gallery = c(gallery);


export const YProps = c(function ({props}) {
    const refSlotTemplate = useRef();
    const Templates = useSlot<AtomicoThis>(refSlotTemplate, el => el instanceof Element);

    useEffect(() => {
        console.debug("YProps:reflecting properties", {props, Templates})
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
