export CLIENT_ID=$(cat key_aicore.json | jq -r .clientid)
export CLIENT_SECRET=$(cat key_aicore.json | jq -r .clientsecret)
export XSUAA_URL=$(cat key_aicore.json | jq -r .url)
export AI_API_URL=$(cat key_aicore.json | jq -r .serviceurls.AI_API_URL)
SECRET=`echo -n "$CLIENT_ID:$CLIENT_SECRET" | base64 -i - `
TOKEN=`curl -s --location --request POST "$XSUAA_URL/oauth/token?grant_type=client_credentials" \
    --header "Authorization: Basic $SECRET" | jq -r '.access_token'`
curl -s --location $AI_API_URL/v2/lm/scenarios/foundation-models/executables --header 'AI-Resource-Group: default' --header "Authorization: Bearer $TOKEN"
echo TOKEN=$TOKEN
echo "GET $AI_API_URL/v2/deployments" > request.http
echo "AI-Resource-Group: default" >> request.http
echo "Authorization: Bearer $TOKEN" >> request.http

##executables
echo "### @scenarios" >> request.http
echo "GET $AI_API_URL/v2/lm/scenarios/foundation-models/executables" >> request.http
echo "AI-Resource-Group: default" >> request.http
echo "Authorization: Bearer $TOKEN" >> request.http

export CONFIG_ID=$(curl --location $AI_API_URL/v2/lm/configurations --header  "AI-Resource-Group: default" --header "Content-Type: application/json" --header "Authorization: Bearer $TOKEN" \
--data '{"name": "gpt-4o", "executableId": "azure-openai", "scenarioId": "foundation-models" ,"versionId": "0.0.1", "parameterBindings": [{ "key": "modelName", "value": "gpt-4o"}]}' | jq -r .id)
echo "### @config" >> request.http
echo  "GET $AI_API_URL/v2/lm/configurations/$CONFIG_ID" >> request.http

export DEPLOYMENT_ID=$(curl --location $AI_API_URL/v2/lm/deployments --header  "AI-Resource-Group: default" --header "Content-Type: application/json" --header "Authorization: Bearer $TOKEN" \
--data "{\"configurationId\": \"$CONFIG_ID\" }" | jq -r .id)
echo "### @deployments" >> request.http
echo  "GET $AI_API_URL/v2/lm/deployments/$DEPLOYMENT_ID" >> request.http

# curl -s --location $AI_API_URL/v2/lm/configurations --header 'AI-Resource-Group: default' --header "Authorization: Bearer $TOKEN" | jq .
# export CONFIG_ID=azure-openai
# export DEPLOYMENT_ID=$(curl --location $AI_API_URL/v2/lm/deployments --header  "AI-Resource-Group: default" --header "Content-Type: application/json" --header "Authorization: Bearer $TOKEN" \
# --data "{\"configurationId\": \"$CONFIG_ID\" }" | jq -r .id)
#curl -s --location $AI_API_URL/v2/lm/deployments --header 'AI-Resource-Group: default' --header "Authorization: Bearer $TOKEN"
#export DEPLOYMENT_ID=a5d4e692-2b50-42bd-984f-339845e273be
#
#curl -s --location $AI_API_URL/v2/lm/deployments/$DEPLOYMENT_ID --header 'AI-Resource-Group: default ' --header "Authorization: Bearer $TOKEN" | jq .