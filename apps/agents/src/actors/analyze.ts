import * as Y from "yjs";
import {UserPost} from "./photos.js";

export type Analysis = {
    title: string,
    value: string,
    description: string,
    likelihood: number,
    weight: number,
    reasoning: string,
    category: string
}
export async function* fakeAnalyzePhotos({photos}: {photos: Y.Array<UserPost>}){
    console.debug("say I analyze photos: ", photos.toArray());
    yield { title: "fake analysis", value: "fake value", description: "fake description", likelihood: 0.5, weight: 0.5, reasoning: "fake reasoning", category: "fake category"};
    yield { title: "fake analysis", value: "fake value", description: "fake description", likelihood: 0.5, weight: 0.5, reasoning: "fake reasoning", category: "fake category"};
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield { title: "fake analysis", value: "fake value", description: "fake description", likelihood: 0.5, weight: 0.5, reasoning: "fake reasoning", category: "fake category"};
}

export  default  fakeAnalyzePhotos