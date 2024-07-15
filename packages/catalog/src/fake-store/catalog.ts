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
export default  data.map(({image, ...product}) => ({
      ...product,
      image: `${image.startsWith('http')?'' : 'http://' }${image}`
    }
)).filter(({categories}) => 
    categories !== "smartphones"
    && categories !== "electronics"
    && categories !== "groceries"
    && categories !== "furniture"
) as Product[];

