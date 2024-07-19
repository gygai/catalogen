import {component$, NoSerialize, useSignal, useStore, useTask$} from "@builder.io/qwik";
import * as Y from "yjs";
import {type UserPost} from "agent/posts";
import {CatalogService, CatalogState} from "agent";
import {Button} from "~/components/login";

export interface PostsGalleryProps {
    store: {
        posts: NoSerialize<Y.Array<UserPost>>,
        service: NoSerialize<CatalogService> | undefined
        state: string
    }
}
export const Confirm = component$(({store: {service, state}}: { store: { service: CatalogService | undefined , state:CatalogState} }) => {
    return <div class="block float-right start-3  *:mr-4 *:py-2  *:px-4">
        <Button
            hidden={state !== 'confirm' }
            disabled={!service}
            onClick$={() => service!.send({
                type: "posts.confirm"
            })}>
            Analyze my preferences
        </Button>
    </div>
});

export const PostsGallery = component$(({store:{state, posts}}: PostsGalleryProps) => {
  
    return <div hidden={state !== 'getUserPhotos' && state !== 'confirm' } > 
        {posts &&
            <y-gallery items={posts} class="float-right start-3 ">
                <user-post></user-post>
            </y-gallery>}
    </div>
})
export default PostsGallery;