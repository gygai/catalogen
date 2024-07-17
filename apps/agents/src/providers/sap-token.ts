import {
    assign,
    createActor,
    createMachine,
    emit,
    fromCallback,
    fromPromise, InputFrom,
    log,
    waitFor
} from "xstate";
 
export async function fetchToken({input: {creds}}: {
    input: { creds: { clientid: string, clientsecret: string, tokenurl: string } }
}) {
     const response = await fetch(`${creds.tokenurl}?grant_type=client_credentials`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${creds.clientid}:${creds.clientsecret}`)}`
        },
        body: JSON.stringify({
            client_id: creds.clientid,
            client_secret: creds.clientsecret,
            grant_type: "client_credentials",
        }),
    });
    if(!isSuccessfulStatus(response.status )) throw new Error(`Failed to fetch token: ${response.statusText}  ${await response.text()}`);
    console.log("success response from token api" , response.status, response.statusText);
    const {access_token} = await response.json();
    return access_token
}


//sb-a9868d84-4cbb-4e26-8be6-1442d51051b3!b313091|aisvc-662318f9-ies-aicore-service!b540:5050fd60-3753-4d1f-a516-3c60da0c6b03$bgVfrP64MBsPr8L8qbHrK69NdDRMK1Dm6yxqkkyFpP4=
//sb-a9868d84-4cbb-4e26-8be6-1442d51051b3!b313091|aisvc-662318f9-ies-aicore-service!b540:5050fd60-3753-4d1f-a516-3c60da0c6b03$bgVfrP64MBsPr8L8qbHrK69NdDRMK1Dm6yxqkkyFpP4= 

/*
  creds: {
      clientid: 'sb-a9868d84-4cbb-4e26-8be6-1442d51051b3!b313091|aisvc-662318f9-ies-aicore-service!b540',
      clientsecret: '5050fd60-3753-4d1f-a516-3c60da0c6b03$bgVfrP64MBsPr8L8qbHrK69NdDRMK1Dm6yxqkkyFpP4= ',
      tokenurl: 'https://sapit-core-playground-vole.authentication.eu10.hana.ondemand.com/oauth/token'
    }

 */
export function isSuccessfulStatus(status: number){
    return status >= 200 && status < 300;
}

//token machine to fetch the token if expired, or not available
const tokenMachine = createMachine({
    id: 'token',
    initial: 'loading',

    types: {
        context: {} as {
            token?: string,
            creds: {
                clientid: string,
                clientsecret: string,
                tokenurl: string
            }
        },
        input: {} as {
            env: typeof process.env
        }
    },
    context: ({input: {env}}) => ({
        creds: {
            clientid: env.SAP_CLIENT_ID!,
            clientsecret: env.SAP_CLIENT_SECRET!,
            tokenurl: env.SAP_TOKEN_URL!
        }
    }),
    states: {
        loading: {
            invoke: {
                src: fromPromise(fetchToken),
                input: ({context}) => ({
                    creds: context.creds
                }),
                onDone: {
                    target: 'success',
                    actions: [assign({
                        token: ({event}) => event.output
                    })]
                },
                onError: {target: 'failure', actions: [log((event) => event)]}
            }
        },
        success: {
            invoke: {
                src: fromCallback(({sendBack}) => {
                    setTimeout(() => {
                        sendBack({
                            type: 'REFRESH'
                        })
                        //30 mins
                    }, 1000 * 30 * 60);
                })
            },
            on: {
                REFRESH: 'loading'
            }
        },
        failure: {
            invoke: {
                src: fromCallback(({sendBack}) => {
                    setTimeout(() => {
                        sendBack({
                            type: 'RETRY'
                        })
                    }, 5000);
                })
            },
            on: {
                RETRY: 'loading'
            }
        }

    }
})

export function createTokenService(input: InputFrom<typeof tokenMachine> = {
    env: process.env
}) {
    const actor = createActor(tokenMachine, {
        input
    })
 
    return {
         actor: actor.start(),
         accessToken: async () => {
             const {context: {token}} = await waitFor(actor, state => state.matches('success'))
             return token!;
         }
    }
}

export function getAccessToken(env=process.env) {
    return createTokenService({env}).accessToken()
}
 
export default tokenMachine;