/*
   Simple mock data to use for the catalog
*/
/* 
await fetch('https://fakestoreapi.com/products?sort=desc').catch(err => console.error(err));
        const data = await response.json();
        data .filter(({category}) =>  category !== 'electronics')
            .map(({id, price, image, title, description, category, ...item}) => ({
                id, category,
                name: title,
                href: `https://fakestoreapi.com/products/category/${item.id}`,
                imageSrc: image,
                imageAlt: description,
                price: `$${price}`,
                color: 'Black'  })) 
*/
export const products= [
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
  },
  {
    "id": 16,
    "category": "women's clothing",
    "name": "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg",
    "imageAlt": "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON",
    "price": "$29.95",
    "color": "Black"
  },
  {
    "id": 15,
    "category": "women's clothing",
    "name": "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
    "imageAlt": "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates",
    "price": "$56.99",
    "color": "Black"
  },
  {
    "id": 8,
    "category": "jewelery",
    "name": "Pierced Owl Rose Gold Plated Stainless Steel Double",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
    "imageAlt": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
    "price": "$10.99",
    "color": "Black"
  },
  {
    "id": 7,
    "category": "jewelery",
    "name": "White Gold Plated Princess",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
    "imageAlt": "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
    "price": "$9.99",
    "color": "Black"
  },
  {
    "id": 6,
    "category": "jewelery",
    "name": "Solid Gold Petite Micropave ",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
    "imageAlt": "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.",
    "price": "$168",
    "color": "Black"
  },
  {
    "id": 5,
    "category": "jewelery",
    "name": "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
    "imageAlt": "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.",
    "price": "$695",
    "color": "Black"
  },
  {
    "id": 4,
    "category": "men's clothing",
    "name": "Mens Casual Slim Fit",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg",
    "imageAlt": "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.",
    "price": "$15.99",
    "color": "Black"
  },
  {
    "id": 3,
    "category": "men's clothing",
    "name": "Mens Cotton Jacket",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    "imageAlt": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
    "price": "$55.99",
    "color": "Black"
  },
  {
    "id": 2,
    "category": "men's clothing",
    "name": "Mens Casual Premium Slim Fit T-Shirts ",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    "imageAlt": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
    "price": "$22.3",
    "color": "Black"
  },
  {
    "id": 1,
    "category": "men's clothing",
    "name": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "href": "https://fakestoreapi.com/products/category/undefined",
    "imageSrc": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    "imageAlt": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    "price": "$109.95",
    "color": "Black"
  },
  {
    "id": 1,
    "name": "Basic Tee",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg",
    "imageAlt": "Front of men's Basic Tee in black.",
    "price": "$35",
    "color": "Black"
  },
  {
    "id": 2,
    "name": "Fashion Hat",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg",
    "imageAlt": "Fashion Hat.",
    "price": "$25",
    "color": "Brown"
  },
  {
    "id": 3,
    "name": "Long Sleeve Shirt",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg",
    "imageAlt": "Long Sleeve Shirt.",
    "price": "$40",
    "color": "Blue"
  },
  {
    "id": 4,
    "name": "Simple Backpack",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg",
    "imageAlt": "Simple Backpack.",
    "price": "$70",
    "color": "Gray"
  },
  {
    "id": 5,
    "name": "Elegant Watch",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-02.jpg",
    "imageAlt": "Elegant Watch.",
    "price": "$150",
    "color": "Silver"
  },
  {
    "id": 6,
    "name": "Women's Basic Tee",
    "href": "#",
    "imageSrc": "https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg",
    "imageAlt": "Back of women's Basic Tee in black..",
    "price": "$120",
    "color": "Black"
  }
]

export default products;