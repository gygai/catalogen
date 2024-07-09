import { ChatOpenAI,ChatOpenAICallOptions } from '@langchain/openai';

export const langchain =(options?:ChatOpenAICallOptions)=> new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-4o',
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_API_URL,

        defaultQuery: {
            'api-version': '2023-05-15',
        },
        defaultHeaders: {
            'ai-resource-group': 'default',
        }
    },
    ...(options || {})
}); 