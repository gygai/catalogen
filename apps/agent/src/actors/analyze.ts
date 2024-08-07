import * as Y from "yjs";
import {UserPost} from "./photos.js";
import {z} from "zod";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {langchain} from "../providers/langchain.js";
 
export const FactSchema = z.object({
    title: z.string().describe("One word description of the characteristic e.g. color, the type of material, etc."),
    value: z.string().describe("Value of the characteristic e.g. red, leather, etc."),
    likelihood: z.number().describe("Likelihood the characteristic from 0 to 100 to the user preference"),
    description: z.string().describe("More explainetory text of the characteristic"),
    weight: z.number().describe("Weight of the characteristic in the final decision for example the number of the times the characteristic is mentioned in the image"),
    reasoning: z.string().describe("Reasoning for the rate"),
    category: z.string().describe("Category of the item in the image e.g. shoes, dress, etc.")
})


export const CharacteristicsSchema = z.object({
    characteristics: z.array(FactSchema) 
        .describe("List of characteristics extracted from the image")
})

 
export type Analysis = z.infer<typeof FactSchema> &{
    time: Date;
};

export async function* getImageCharacteristics({photos:posts}: {photos: Y.Array<UserPost>}):AsyncGenerator<Analysis> {
    console.debug("say I analyze photos: ", posts.toArray());
    const model = await langchain();
    // return "done"

    const stream = await model.withStructuredOutput(CharacteristicsSchema)
    .stream(
        [
            new SystemMessage("You are a persona analyer bot for fashion shopper assistant.\n that uses a list of social media posts to extract the user's favorite characteristics."),
            new HumanMessage("Here are a list of items I posted on social media."),
            ...posts.map(post => new HumanMessage({
                "content": [
                    {"type": "image_url", "image_url": {url: post.media_url}},
                    {"type": "text", "text": post.caption}
                ]
            })),
            new HumanMessage("can you please extract a list of characteristics that I favor ?. please include color, style, the type of material and type of  in the list of characteristics.")
        ]);
    
    for await (const delta of stream) {
        console.debug("delta", delta);
        for (const deltaElement of delta.characteristics) {
            yield {
                ...deltaElement,
                time: new Date(),
            };
        }
    }
    
    return "done";
}

export async function* fakeAnalyzePhotos({photos}: {photos: Y.Array<UserPost>}):AsyncGenerator<Analysis> {
    console.debug("say I analyze photos: ", photos.toArray().slice(0, 2), "...");
    yield { description: "red", title: "color", value: "red", likelihood: 100, weight: 1, reasoning: "red is the most mentioned color in the image", category: "shoes", time: new Date() };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield { description: "leather", title: "material", value: "leather", likelihood: 100, weight: 1, reasoning: "leather is the most mentioned material in the image", category: "shoes", time: new Date() };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    yield {description: "style" , title: "style", value: "casual", likelihood: 100, weight: 1, reasoning: "casual is the most mentioned style in the image", category: "shoes", time: new Date() };
}

  
export  default  getImageCharacteristics