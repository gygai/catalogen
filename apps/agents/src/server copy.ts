#!/usr/bin/env ts-node
import { openai } from '@ai-sdk/openai';
import { CoreMessage, generateText, streamText } from 'ai';
import {config} from 'dotenv';
import * as readline from 'node:readline/promises';
import {openaiGP4o} from "./providers/openai.js";
import * as fs from "node:fs"

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
    while (true) {
        const userInput = await terminal.question('You: ');
const prodactmodel = `    "id": 204464479,
    "category": "shoes",
    "name": "Timberland premium 6inch boots in wheat tan nubuck",
    "href": "timberland/timberland-premium-6inch-boots-in-wheat-tan-nubuck/prd/204464479#colourWayId-204464495",
    "imageSrc": "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-1-beige",
    "imageAlt": "Timberland premium 6inch boots in wheat tan nubuck",
    "price": "$214.00",
    "color": "BEIGE"`
    const prudact = `{
      "id": 206333726,
      "name": "ASOS DESIGN chunky lace up shoes in black",
      "price": {
        "current": {
          "value": 52.99,
          "text": "$52.99"
        },
        "previous": {
          "value": null,
          "text": ""
        },
        "rrp": {
          "value": null,
          "text": ""
        },
        "isMarkedDown": false,
        "isOutletPrice": false,
        "currency": "USD"
      },
      "colour": "Black",
      "colourWayId": 206333727,
      "brandName": "ASOS DESIGN",
      "hasVariantColours": false,
      "hasMultiplePrices": false,
      "groupId": null,
      "productCode": 134900311,
      "productType": "Product",
      "url": "asos-design/asos-design-chunky-lace-up-shoes-in-black/prd/206333726#colourWayId-206333727",
      "imageUrl": "images.asos-media.com/products/asos-design-chunky-lace-up-shoes-in-black/206333726-1-black",
      "additionalImageUrls": [
        "images.asos-media.com/products/asos-design-chunky-lace-up-shoes-in-black/206333726-2",
        "images.asos-media.com/products/asos-design-chunky-lace-up-shoes-in-black/206333726-3",
        "images.asos-media.com/products/asos-design-chunky-lace-up-shoes-in-black/206333726-4"
      ],
      "videoUrl": null,
      "showVideo": false,
      "isSellingFast": false,
      "isRestockingSoon": false,
      "isPromotion": false,
      "sponsoredCampaignId": null,
      "facetGroupings": [],
      "advertisement": null
    },
    {
      "id": 204464479,
      "name": "Timberland premium 6inch boots in wheat tan nubuck",
      "price": {
        "current": {
          "value": 214.0,
          "text": "$214.00"
        },
        "previous": {
          "value": null,
          "text": ""
        },
        "rrp": {
          "value": null,
          "text": ""
        },
        "isMarkedDown": false,
        "isOutletPrice": false,
        "currency": "USD"
      },
      "colour": "BEIGE",
      "colourWayId": 204464495,
      "brandName": "Timberland",
      "hasVariantColours": false,
      "hasMultiplePrices": false,
      "groupId": null,
      "productCode": 127319656,
      "productType": "Product",
      "url": "timberland/timberland-premium-6inch-boots-in-wheat-tan-nubuck/prd/204464479#colourWayId-204464495",
      "imageUrl": "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-1-beige",
      "additionalImageUrls": [
        "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-2",
        "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-3",
        "images.asos-media.com/products/timberland-premium-6inch-boots-in-wheat-tan-nubuck/204464479-4"
      ],
      "videoUrl": null,
      "showVideo": false,
      "isSellingFast": false,
      "isRestockingSoon": false,
      "isPromotion": false,
      "sponsoredCampaignId": null,
      "facetGroupings": [],
      "advertisement": null
    },`
    // please change the structure of the followimg prodact to the model i will provide you.

    // messages.push({ role: 'user', content: userInput });
        messages.push ({role: `user`, content: `convert this prodact product: """${prudact }""" to the followind model: """${prodactmodel }"""`})
       // messages.push({ role: 'user', content: `product: ${prudact }`});

        //messages.push({ role: 'user', content: `model: ${prodactmodel }` });

        const result = await streamText({
            model: openaiGP4o,
              system: `You are responsible to convert the products to the followind model: """${prodactmodel }"""`,
            messages,
            maxTokens: 1024,
            temperature: 0.7,
            topP: 1,
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
        }
        process.stdout.write('\n\n');

        messages.push({ role: 'assistant', content: fullResponse });
        fs.writeFile('./test.txt',fullResponse, err => {
            if (err) {
              console.error(err);
            } else {
              // file written successfully
            }
          });
    }
}

main().catch(console.error);


const content = 'Some content!';
fs.writeFile('./test.txt', content, err => {
  if (err) {
    console.error(err);
  } else {
    // file written successfully
  }
});
