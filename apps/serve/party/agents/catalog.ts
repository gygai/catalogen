'use strict';
import * as Y from "yjs";
 import { z } from "zod";
import {assign, createActor, fromObservable, fromPromise, setup} from "xstate";
import {createAgent} from "@statelyai/agent";
import {openaiGP4o} from "./openai";

const fakeLogin = fromPromise(async (ctx, {data}) => {
    console.log("say i do login", data);
    return {token: "fake token" , user: {name: "fake user"}};
})

const fakeGetUserPhotos = fromPromise(async (ctx, {data}) => {
    console.log("say i do get user photos", data);
    return ["photo1", "photo2", "photo3"];
})

const fakeAnalyzePhotos = fromPromise(async (ctx, {data}) => {
    console.log("say i do analyze photos", data);
    return [
        {
            "title": "color",
            "value": "black",
            "description": "Black color for shoes",
            "likelihood": 90,
            "weight": 2,
            "reasoning": "Black shoes are mentioned twice with positive comments",
            "category": "shoes"
        },
        {
            "title": "color",
            "value": "red",
            "description": "Red color for shoes",
            "likelihood": 10,
            "weight": 1,
            "reasoning": "Red shoes are mentioned with a negative comment",
            "category": "shoes"
        },
        {
            "title": "style",
            "value": "comfortable",
            "description": "Comfortable style of shoes",
            "likelihood": 80,
            "weight": 1,
            "reasoning": "Comfort is mentioned positively in one post",
            "category": "shoes"
        },
        {
            "title": "style",
            "value": "stylish",
            "description": "Stylish appearance of shoes",
            "likelihood": 70,
            "weight": 1,
            "reasoning": "Stylish is mentioned positively in one post",
            "category": "shoes"
        },
        {
            "title": "style",
            "value": "simple",
            "description": "Simple design",
            "likelihood": 60,
            "weight": 1,
            "reasoning": "Preference for simple designs inferred from dislike of flashy red shoes and like of simple black and white shoes",
            "category": "shoes"
        },
        {
            "title": "type of material",
            "value": "leather",
            "description": "Leather material for shoes",
            "likelihood": 80,
            "weight": 1,
            "reasoning": "Positive comment on leather shoes",
            "category": "shoes"
        },
        {
            "title": "type of material",
            "value": "synthetic",
            "description": "Synthetic material for shoes",
            "likelihood": 50,
            "weight": 1,
            "reasoning": "Neutral comment on synthetic material shoes",
            "category": "shoes"
        }
    ];
})

const fakeGetCatalog= fromObservable(async (ctx, {data}) => {
    console.log("say i do get catalog", data);
    return [
        {
            "id": 20,
            "category": "women's clothing",
            "name": "DANVOUY Womens T Shirt Casual Cotton Short",
            "href": "https://fakestoreapi.com/products/category/undefined",
            "imageSrc": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
            "imageAlt": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
            "price": "$12.99",
            "color": "Black"
        },
        {
            "id": 19,
            "category": "women's clothing",
            "name": "Opna Women's Short Sleeve Moisture",
            "href": "https://fakestoreapi.com/products/category/undefined",
            "imageSrc": "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg",
            "imageAlt": "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort",
            "price": "$7.95",
            "color": "Black"
        },
        {
            "id": 18,
            "category": "women's clothing",
            "name": "MBJ Women's Solid Short Sleeve Boat Neck V ",
            "href": "https://fakestoreapi.com/products/category/undefined",
            "imageSrc": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
            "imageAlt": "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
            "price": "$9.85",
            "color": "Black"
        },
        {
            "id": 17,
            "category": "women's clothing",
            "name": "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
            "href": "https://fakestoreapi.com/products/category/undefined",
            "imageSrc": "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg",
            "imageAlt": "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.",
            "price": "$39.99",
            "color": "Black"
        }
    ];
})
    

 type Product = {
     id: number,
     category: string,
     name: string,
     href: string,
     imageSrc: string,
     imageAlt: string,
     price: string,
     color: string
 }
 
 type Analysis = {
        title: string,
        value: string,
        description: string,
        likelihood: number,
        weight: number,
        reasoning: string,
        category: string
  }

const agent = createAgent({
    name: "catalog-agent",
    model: openaiGP4o ,  
    events: {
       'login': z.object({
            token: z.string().describe('The token of the user'),
         }),
        'new-user-photos':z.object({
            photos: z.array(z.string()).describe('The photos of the user'),
        }),
        'analysis': z.object({
            analysis: z.array(z.object({
                title: z.string(),
                value: z.string(),
                description: z.string(),
                likelihood: z.number(),
                weight: z.number(),
                reasoning: z.string(),
                category: z.string()
            })).describe('The analysis of the photos'),
        }),
        'add-catalog-item': z.object({
                 id: z.number(),
                category: z.string(),
                name: z.string(),
                href: z.string(),
                imageSrc: z.string(),
                imageAlt: z.string(),
                price: z.string(),
                color: z.string()
            }).describe('add a catalog item'),
        'remove-catalog-item': z.object({
            id: z.number()
        }).describe('remove a catalog item'),
        
    }
});

 const catalogMachine = setup({
         actors: {
             login: fakeLogin,
             getUserPhotos: fakeGetUserPhotos,
             analyzeUserPhotos: fakeAnalyzePhotos,
             getCatalog: fakeGetCatalog

         },
         types: {
             context: {
                 photos: new Y.Array<string>(),
                 analysis:new Y.Array<Analysis>(),
                 products:new Y.Array<Product>(),
                 catalog:new Y.Array<Product>(),
                 token: undefined as string | undefined
             },
             input: {
                 store: new  Y.Doc ()
             }
         }
     }).createMachine({
         context: ({input: {store}}) => ({
             photos: store.getArray<string>("photos"),
             products: store.getArray<Product>("products"),
             catalog: store.getArray<Product>("catalog"),
             analysis: store.getArray<Analysis>("analysis") ,
             token: undefined
         }), 
        
     states: {
         login: {
             invoke: {
                 src: "login",
                 onDone: {
                     target: "getUserPhotos",
                     actions: assign({token: (_, event) => event.data.token})
                 }
             }
         },
         getUserPhotos: {
             invoke: {
                 src: "getUserPhotos",  
             },
             on:{
                 'new-user-photos': {
                     target: "analyzeUserPhotos",
                     guards: 'photo-length-ok'
                 }
             }
         },
         analyzeUserPhotos: {
             invoke: {
                 src: "analyzeUserPhotos",
             },
             on: {
                 'analysis': {
                     target: "getCatalog",
                     guards: 'analysis-length-ok'
                 }
             }
         },
         getCatalog: {
             invoke: {
                 src: "getCatalog",
                 onDone: {
                     target: "done",
                     actions: assign({catalog: (_, event) => event.data})
                 }
             }
         },
         done: {
             type: "final"
         }
     }
 })
     
     
  export function catalog(doc:Y.Doc) { 
     
     const actor = createActor(catalogMachine, {
         logger: (msg) => console.log(msg),
        input: {store: doc}
     }).start();
     
    actor.subscribe((state) => {
        console.log("state", state);
    });

    return doc; 
}

 