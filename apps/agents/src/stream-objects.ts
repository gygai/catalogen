import {openaiGP4o} from "./providers/openai.js";
import {streamObject} from "ai";
import { z } from "zod";

const { partialObjectStream } = await streamObject({
    model: openaiGP4o,
    schema: z.object({
        recipe: z.object({
            name: z.string(),
            ingredients: z.array(z.string()),
            steps: z.array(z.string()),
        }),
    }),
    prompt: 'Generate a lasagna recipe.',
});

for await (const partialObject of partialObjectStream) {
    console.clear();
    console.log(partialObject);
}
