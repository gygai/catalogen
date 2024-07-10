import * as Y from "yjs";
import type {BaseRetriever} from "@langchain/core/retrievers";
import {Analysis} from "./analyze.js";

export type Product = {
    id: number,
    category: string,
    name: string,
    href: string,
    imageSrc: string,
    imageAlt: string,
    price: string,
    color: string
}
async function* fakeGetCatalog( {analysis, products}: {analysis: Y.Array<Analysis>, products:BaseRetriever}) {
    console.debug("say i generate catalog based on: ", analysis.toArray());
    await new Promise((resolve) => setTimeout(resolve, 60));

    yield {
        type: 'catalog.add',
        "id": 20,
        "category": "women's clothing",
        "name": "DANVOUY Womens T Shirt Casual Cotton Short",
        "href": "https://fakestoreapi.com/products/category/undefined",
        "imageSrc": "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
        "imageAlt": "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
        "price": "$12.99",
        "color": "Black"
    }
    await new Promise((resolve) => setTimeout(resolve, 60));

    yield {
        type: 'catalog.add',
        "id": 18,
        "category": "women's clothing",
        "name": "MBJ Women's Solid Short Sleeve Boat Neck V ",
        "href": "https://fakestoreapi.com/products/category/undefined",
        "imageSrc": "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg",
        "imageAlt": "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem",
        "price": "$9.85",
        "color": "Black"
    }

    await new Promise((resolve) => setTimeout(resolve, 60));

}

export default fakeGetCatalog