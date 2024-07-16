/*
   Simple mock data to use for the catalog
*/
/* 
await fetch('https://fakestoreapi.com/products?sort=desc').catch(err => console.error(err));
        const data = await response.json();
        data .filter(({category}) =>  category !== 'electronics')
            .map(({id, price, image, title, description, category, ...item}) => ({
                id, 
                categories:category,
                title:title,
                name: title,
                href: `https://fakestoreapi.com/products/category/${item.id}`,
                image: image,
                summary: description,
                price: `$${price}`,
                spec: 'color:Black'  })) 
*/

import data from './data.json';
 


export type  Product = typeof data[0];

function fixImageUrl({image, ...product}: Product){
    return {
        ...product,
        image: `${image.startsWith('http')?'' : 'http://' }${image}`
    }
}
export default  data.reverse().map(({image, ...product}) => ({
      ...product,
      image: `${image.startsWith('http')?'' : 'http://' }${image}`
    }
)).filter(({categories}) => 
    categories !== "smartphones"
    && categories !== "electronics"
    && categories !== "groceries"
    && categories !== "furniture"
) as Product[];

export function catalog(): Record<Product["categories"], Product[]>{
 return data
        .map(fixImageUrl) 
        .reduce((acc, item) => {
            acc[item.categories] = [...(acc[item.categories] || []), item];
            return acc;
        }, {} as Record<string, Product[]>);

}
 