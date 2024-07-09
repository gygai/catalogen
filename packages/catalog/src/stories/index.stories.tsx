import {Gallery} from "@y-block/gallery";
import {define} from "@atomico/storybook";
import * as Y from "yjs";

export default {
    title: "@y-block/gallery",
    ...define(Gallery)
};

export const Story = (props) => {
    const array = new Y.Doc().getArray("array");
    array.push([{
        id: 1,
        name: 'Basic Tee',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
        imageAlt: "Front of men's Basic Tee in black.",
        price: '$35',
        color: 'Black',
    }, {
        id: 2,
        name: 'Fashion Hat',
        href: '#',
        imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
        imageAlt: "Fashion Hat.",
        price: '$25',
        color: 'Brown',
    },
        {
            id: 3,
            name: 'Long Sleeve Shirt',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-02.jpg',
            imageAlt: "Long Sleeve Shirt.",
            price: '$40',
            color: 'Blue',
        },
        {
            id: 4,
            name: 'Simple Backpack',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-03.jpg',
            imageAlt: "Simple Backpack.",
            price: '$70',
            color: 'Gray',
        },
        {
            id: 5,
            name: 'Elegant Watch',
            href: '#',
            imageSrc: '	https://tailwindui.com/img/ecommerce-images/confirmation-page-03-product-02.jpg',
            imageAlt: "Elegant Watch.",
            price: '$150',
            color: 'Silver',
        },

        {
            id: 6,
            name: `Women's Basic Tee`,
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-featured-product-shot.jpg',
            imageAlt: "Back of women's Basic Tee in black..",
            price: '$120',
            color: 'Black',
        },
        {
            id: 1,
            name: 'Basic Tee',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
            imageAlt: "Front of men's Basic Tee in black.",
            price: '$35',
            color: 'Black',
        }, {
            id: 2,
            name: 'Fashion Hat',
            href: '#',
            imageSrc: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
            imageAlt: "Fashion Hat.",
            price: '$25',
            color: 'Brown',
        }

    ])
    return <y-gallery items={array} {...props} >
        <product-card $:name={"name"} $:id={"id"} $:color={"color"} $:image-alt={"imageAlt"} $:image-src="imageSrc"
                      $:price="price" $:href="href"></product-card>
    </y-gallery>
}
 
