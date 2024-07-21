import {createOpenAI} from "@ai-sdk/openai";
import {createTokenService} from "./sap-token.js";

//convert to ts
/*export CLIENT_ID=$(cat key.json | jq -r .clientid)
export CLIENT_SECRET=$(cat key.json | jq -r .clientsecret)
export XSUAA_URL=$(cat key.json | jq -r .url)
export AI_API_URL=$(cat key.json | jq -r .serviceurls.AI_API_URL)
SECRET=`echo -n "$CLIENT_ID:$CLIENT_SECRET" | base64 -i - `
TOKEN=`curl -s --location --request POST "$XSUAA_URL/oauth/token?grant_type=client_credentials" \
    --header "Authorization: Basic $SECRET" | jq -r '.access_token'`
curl -s --location $AI_API_URL/v2/lm/scenarios/foundation-models/executables --header 'AI-Resource-Group: default' --header "Authorization: Bearer $TOKEN"
const apikeytoken
const apiurl
 */


const tokenService = createTokenService({
    env: process.env
})
const customFetch:typeof fetch=async (url, request) => {
     console.log('ai-request', url, request) 
    
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
    console.debug('ai-response', response)
    return response;
    

}
export const openaiGP4o=createOpenAI({
       baseURL: `${process.env.SAP_AI_API_URL}/v2/inference/deployments/${process.env.SAP_AI_DEPLOYMENT_ID}`,
       
       fetch: customFetch
}).chat('gpt-4o')