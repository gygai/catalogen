import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

const serviceKey = {
    "serviceurls": {
        "AI_API_URL": "https://api.ai.prod.eu-central-1.aws.ml.hana.ondemand.com/v2/inference/deployments/d74b3f70ae904c59"
    },
    "appname": "a9868d84-4cbb-4e26-8be6-1442d51051b3!b313091|aisvc-662318f9-ies-aicore-service!b540",
    "clientid": "sb-a9868d84-4cbb-4e26-8be6-1442d51051b3!b313091|aisvc-662318f9-ies-aicore-service!b540",
    "clientsecret": "***REMOVED***",
    "identityzone": "sapit-core-playground-vole",
    "identityzoneid": "2aaefd82-b1fe-4b56-aa22-851c0e271604",
    "url": "https://sapit-core-playground-vole.authentication.eu10.hana.ondemand.com"
};
const models = ["gpt-35-turbo", "gpt-35-turbo-16k", "gpt-4", "gpt-4-32k", "gpt-4-turbo", "gpt-4-vision"];


var model: ChatOpenAI = null;



/**
 * Functions
 */


async function getAPIToken(): Promise<string> {
    if (apiToken && new Date() < apiTokenExpiry) {
        return apiToken;
    }
    var clientId = serviceKey['clientid'];
    var clientSecret = serviceKey['clientsecret'];
    var authUrl = serviceKey['url'];
    var baseAuth = btoa(`${clientId}:${clientSecret}`).toString();
    try {
        const response = await fetch(
            `${authUrl}/oauth/token?grant_type=client_credentials`,
            {
                method: "GET",
                headers: {
                    Authorization: `Basic ${baseAuth}`
                }
            }
        );
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        //    console.debug(`Successfully retrieved API token`);

        apiToken = data.access_token;
        apiTokenExpiry = new Date();
        // Add 30 min to apiTokenExpiry
        apiTokenExpiry.setMinutes(apiTokenExpiry.getMinutes() + 30);

        return apiToken;
    } catch (error) {
        let errorMsg = "Invalid API Token Call " + error;
        console.error(errorMsg);
        // clean apitoken on error
        apiToken = null;
        console.log("Cleanning api token on API Token CALL error.");
        throw new Error(errorMsg);
    }
}


async function getImageCharacteristics(imageUrl: string, type: string, description: string): Promise<ItemCharacteristic[]> {
    const characteristics =
        z.object({
            characteristics: z.array(z.object({
                title: z.string().describe("One word description of the characteristic e.g. color, the type of material, etc."),
                value: z.string().describe("Value of the characteristic e.g. red, leather, etc."),
                description: z.string().describe("More explainetory text of the characteristic"),
                weight: z.number().describe("Weight of the characteristic in the final decision for example the number of the times the characteristic is mentioned in the image"),
                reasoning: z.string().describe("Reasoning for the rate"),
                category: z.string().describe("Category of the item in the image e.g. shoes, dress, etc.")
            }))
        }).describe("List of characteristics extracted from the image");

    const result = await model.withStructuredOutput(characteristics).invoke(
        [
            new SystemMessage("You are a helpful assistant."),
            new HumanMessage(`Here is an image of ${type} with the following description :\n ${description}`),
            new HumanMessage({
                "content": [
                    {
                        "type": "text",
                        "text": `Here is an image of ${type} with the following description :\n ${description}`
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            url: imageUrl
                        }
                    }
                ]
            }),
            new HumanMessage("can you please extract a list of characteristics from it ?")
        ]
    )

    return result.characteristics;

}

async function getUserFavouritesCharacteristics(posts: SocialMediaPost[]): Promise<ItemCharacteristic[]> {

    const characteristics =
        z.object({
            characteristics: z.array(z.object({
                title: z.string().describe("One word description of the characteristic e.g. color, the type of material, etc."),
                value: z.string().describe("Value of the characteristic e.g. red, leather, etc."),
                likelihood: z.number().describe("Likelihood the characteristic from 0 to 100 to the user preference"),
                description: z.string().describe("More explainetory text of the characteristic"),
                weight: z.number().describe("Weight of the characteristic in the final decision for example the number of the times the characteristic is mentioned in the image"),
                reasoning: z.string().describe("Reasoning for the rate"),
                category: z.string().describe("Category of the item in the image e.g. shoes, dress, etc.")
            }))
        }).describe("List of characteristics extracted from the image");
    /*
    
    */
    const result = await model.withStructuredOutput(characteristics).invoke(
        [
            new SystemMessage("You are a persona analyer bot for fashion shopper assistant.\n that uses a list of social media posts to extract the user's favorite characteristics."),
            new HumanMessage("Here are a list of items I posted on social media."),
            ...posts.map(post => new HumanMessage({
                "content":
                    [
                        { "type": "image_url", "image_url": { url: post.imageUrl } },
                        { "type": "text", "text": post.text }
                    ]

            })),
            new HumanMessage("can you please extract a list of characteristics that I favor ?. please include color, style, the type of material and type of  in the list of characteristics.")
        ]);

    return result.characteristics;

}

async function initModel(): Promise<void> {
    model = new ChatOpenAI({
        temperature: 0.7,
        model: "gpt-4",
        maxTokens: 1000,
        openAIApiKey: await getAPIToken(),
        configuration: {

            baseURL: serviceKey.serviceurls.AI_API_URL,
            defaultHeaders: {
                "ai-resource-group": "default"
            },
            defaultQuery: {
                "api-version": "2023-05-15"
            }
        }
    });

    setInterval(async () => {
        model.openAIApiKey = await getAPIToken();
    }, 1000);
}

(async function () {

    await initModel();

    console.log("Starting the AI Engine");
    console.log(JSON.stringify(await getImageCharacteristics("https://m.media-amazon.com/images/I/71nVRe1IaWL._AC_UY900_.jpg", "shoes", "A pair of shoes with a white sole and black upper."), null, 2));


    var fav = await getUserFavouritesCharacteristics([
        { imageUrl: 'https://pavers.ie/cdn/shop/products/976973_grande.jpg?v=1626594193', text: "I really like this pair of shoes. They are very comfortable and stylish." },
        { imageUrl: 'https://images.halloweencostumes.eu/products/85337/1-1/red-clown-shoes.jpg', text: " I hate it, its not my style or even my color" },
        { imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/63c77c04dc6448548ccbae880189e107_9366/Galaxy_6_Shoes_Black_GW3848_01_standard.jpg', text: "I like the design but I am not sure about the color." },]);


    console.log(JSON.stringify(fav, null, 2));

    return;



})();



/*


*/

interface ItemCharacteristic {
    title?: string,
    value?: string,
    description?: string,
    weight?: number,
    reasoning?: string,
    category?: string
}

interface SocialMediaPost {
    imageUrl: string;
    text: string;
}

/**
 * STARTUP
 */



