import { ChatOpenAI,ChatOpenAICallOptions } from '@langchain/openai';
import { getAccessToken} from "./sap-token.js";
 
export const langchain =async (options?: ConstructorParameters<typeof ChatOpenAI>[0] , env =process.env) => new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4o',
    openAIApiKey: await getAccessToken(),
    configuration: {
        baseURL: env.OPENAI_API_URL,  
        defaultQuery: {
            'api-version': '2023-05-15',
        },
        defaultHeaders: {
            'ai-resource-group': 'default',
        },
        ...(options?.configuration || {})
    },
    ...(options || {})
}); 