import {component$, NoSerialize, useSignal, useStore, useTask$} from "@builder.io/qwik";
import * as Y from "yjs";
import type {Product} from "@y-block/gallery";
import {isServer} from "@builder.io/qwik/build";
import {type UserPost} from "agent/posts";
import {CatalogService} from "agent";
import {Button} from "~/components/login";

export interface PostsGalleryProps {
    store: {
        posts: NoSerialize<Y.Array<UserPost>>,
        service: NoSerialize<CatalogService> | undefined
    }
}
export const Confirm = component$(({store: {service}}: { store: { service: CatalogService | undefined } }) => {
    return <div class="block float-right start-3  *:mr-4 *:py-2  *:px-4">
        <Button
            disabled={!service}
            onClick$={() => service!.send({
                type: "posts.confirm"
            })}>
            Analyze my preferences
        </Button>
    </div>
});

export const PostsGallery = component$(({store}: PostsGalleryProps) => {
    const popoverRef = useSignal<HTMLElement | undefined>();

    useTask$(async ({track}) => {
        track(() => store.service)
        const subscription = store.service?.subscribe(async (state) => {
            console.debug("state:posts", state.value)
            if (state.value === "confirm") {
                popoverRef.value && popoverRef.value.showPopover();
            } else {
                popoverRef.value && popoverRef.value.hidePopover();
            }
        })
        return () => subscription?.unsubscribe();
    })
    return <div popover={"manual"} ref={popoverRef}
                class="  self-center justify-center   h-full bg-opacity-60 filter w-full   backdrop-filter backdrop-saturate-150	backdrop-blur-3xl backdrop ">
        <Confirm store={store!}></Confirm>
        {store.posts &&
            <y-gallery items={store.posts} class="float-right start-3 ">
                <user-post></user-post>
            </y-gallery>}
    </div>
})
export default PostsGallery;