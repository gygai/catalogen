import { ChatOpenAI,ChatOpenAICallOptions } from '@langchain/openai';
import { getAccessToken} from "./sap-token.js";
 
export const langchain =async (options?: ConstructorParameters<typeof ChatOpenAI>[0] , env =process.env) => {
    console.log("langchain" , env.OPENAI_BASE_URL)
   return  new ChatOpenAI({
    temperature: 0.7,
    modelName: 'gpt-4o',
    openAIApiKey: await getAccessToken(),
    configuration: {
        baseURL: env.OPENAI_BASE_URL,  
        defaultQuery: {
            'api-version': env.OPENAI_API_VERSION,
        },
        dangerouslyAllowBrowser: true,
        maxRetries: 1  ,
        timeout: 1000,
        defaultHeaders: {
            'ai-resource-group': 'default',
        },
        ...(options?.configuration || {})
    },
    ...(options || {})
})
}

