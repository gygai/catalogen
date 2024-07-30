import {createOpenAI} from "@ai-sdk/openai";
import {tokenService} from "./sap-token.js";


const customFetch:typeof fetch=async (url, request) => {
    //  console.debug('ai-request', url, request) 
    
    const access_token = await tokenService.accessToken();
    request = request ?? {};
    const response=await  fetch(`${url}/?api-version=2023-05-15`,
        {
            ...request,
            body: request.body,
            method: request.method,
            headers: { 
                ...(request.headers ? Object.fromEntries(
                    Object.entries(request.headers)
                ) : {}),
                'ai-resource-group': 'default',
                Authorization:  `Bearer ${access_token}`
            }
            }
        )
    // console.debug('ai-response', response)
    return response;
    

}
export const openaiGP4o= ()=>createOpenAI({
       apiKey: ' value dummy: ai sdk will faill the call if no is provided',
       baseURL: `${process.env.SAP_AI_API_URL}/v2/inference/deployments/${process.env.SAP_AI_DEPLOYMENT_ID}`,
       
       fetch: customFetch
}).chat('gpt-4o')