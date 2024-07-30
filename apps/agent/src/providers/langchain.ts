import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import {  tokenService} from "./sap-token.js";
 
export const langchain =async (options?: ConstructorParameters<typeof ChatOpenAI>[0] , env =process.env) => {
   return  new ChatOpenAI({
    temperature: 0.7,
    modelName: 'gpt-4o',
    openAIApiKey: await tokenService.accessToken(),
    configuration: {
        baseURL: `${process.env.SAP_AI_API_URL}/v2/inference/deployments/${process.env.SAP_AI_DEPLOYMENT_ID}`,  
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


export const langchainEmbedding = async (options?: ConstructorParameters<typeof OpenAIEmbeddings>[0] , env =process.env) => {
   return  new OpenAIEmbeddings({
    modelName: 'text-embedding-ada-002',
    openAIApiKey: await tokenService.accessToken(),
    configuration: {
        baseURL: `${process.env.SAP_AI_API_URL}/v2/inference/deployments/${process.env.SAP_AI_EMBEDDINGS_DEPLOYMENT_ID}`,  
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