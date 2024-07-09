#!/usr/bin/env ts-node
import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText, streamText } from 'ai';
import { config } from 'dotenv';
import * as readline from 'node:readline/promises';
import { openaiGP4o } from "./providers/openai.js";
import * as fs from "node:fs"
import { fromTextStream } from '@statelyai/agent';

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
   
    //   const userInput = await terminal.question('You: ');
        const prodactmodel = `    "id": 204464479,
    "category": "shoes",
    "name": "Timberland premium 6inch boots in wheat tan nubuck",
    "href": "timberland/timberland-premium-6inch-boots-in-wheat-tan-nubuck/prd/204464479#colourWayId-204464495",
    "imageSrc": "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-1-beige",
    "imageAlt": "Timberland premium 6inch boots in wheat tan nubuck",
    "price": "$214.00",
    "color": "BEIGE"`
        const prudact = fs.readFileSync('./products.jsonl', 'utf8',)
        const file= "DATA.jsonl";
        fs.writeFileSync(file , '')
        var products = splitArrayIntoChunks(JSON.parse(prudact).products, 10);

        for (let index = 0; index < products.length; index++) {
            const productsChunk = products[index];



            // please change the structure of the followimg prodact to the model i will provide you.

            // messages.push({ role: 'user', content: userInput });
            messages.push({ role: `user`, content: `convert this prodact product: """${JSON.stringify(productsChunk)}""" to the followind model: """${prodactmodel}""" write only json response with no additinal comments` })
            // messages.push({ role: 'user', content: `product: ${prudact }`});

            //messages.push({ role: 'user', content: `model: ${prodactmodel }` });
            console.log (`prossimg new chunk ${index}/${products.length}`)
             const result = await streamText({
                model: openaiGP4o,
                system: `You are responsible to convert the products to the followind model: """${prodactmodel}"""`,
                messages,
                maxTokens: 4000,
                temperature: 0,
                topP: 1,
                onFinish: (r)  => {
                    if(r.finishReason !== 'stop')
                        console.error(r.finishReason)
                    else
                    console.log(r.finishReason) 
                }
            });
            // const result = await generateText({
            //     model: openaiGP4o,
            //     messages,
            //     maxTokens: 1024,
            //     temperature: 0.7,
            //     topP: 1,
            //   })

            //   console.log(result.text)


 
      
            let fullResponse = '';
            process.stdout.write('\nAssistant: ');
            for await (const delta of result.textStream) {
                fullResponse += delta;
                process.stdout.write(delta);
                fs.appendFileSync(file, delta)
            }

            

            process.stdout.write('\n\n');

            messages.push({ role: 'assistant', content: fullResponse });
            fs.writeFile(`./test${index}.json`, fullResponse, err => {
                if (err) {
                    console.error(err);
                } else {
                    // file written successfully
                }
            });
        }
    }


main().catch(console.error);



function splitArrayIntoChunks(arr, chunkSize) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}