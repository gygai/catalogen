import {c, css} from "atomico";
export type UserPost = {
    caption?: string;
    media_type?: string;
    media_url: string;
    media_height?: number;
    media_width?: number;
    id: number; 
}


export const UserPost = c(function ({media_url, caption , media_width, media_height}: UserPost) {
    return (
        <host shadowDom>
            <div class={"group relative ease-in-out duration-300  h-96 overflow-y-hidden rounded-lg"}>
                <div
                    class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80 transition-all ">
                    <img src={media_url} alt={caption} width={media_width} height={media_height}
                         class="h-full w-full object-cover object-center lg:h-full lg:w-full"/>
                </div> 
                <div class="mt-4 inline-flex items-center">
 
                    <lablel class="relative flex cursor-pointer items-center rounded-full p-3 h-5"                      
                            for="add"> 
                            <input id="add"
                                   aria-describedby="add-text"
                                   type="checkbox"  
                                   class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-violet-500 checked:bg-violet-500 checked:before:bg-violet-500 hover:before:opacity-10"
                                   />
                            <div class="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    stroke="currentColor"
                                    stroke-width="1"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </div>
                        </lablel>
                        <div class="ms-2 text-sm">
                            <label for="add" class="font-medium text-gray-900 dark:text-gray-300">Add this photo for AI to analyze</label>
                            <p id="add-text" class="text-xs font-normal text-gray-500 dark:text-gray-300">The AI will use this photo to understand your style and preferences.</p> 
                        </div> 
                </div>
               <slot> </slot>
            </div>

        </host>
    );
}, {
    styles: css`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @tailwind screens;
        
        :host {
            @apply block;
        }
    `,
    props: {
        media_url: {
            type: String,
            reflect: true,
        },
        caption: {
            type: String,
            reflect: true,
        },
        media_width: {
            type: Number,
            reflect: true,
        },
        media_height: {
            type: Number,
            reflect: true,
        }
    }
});

// class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
