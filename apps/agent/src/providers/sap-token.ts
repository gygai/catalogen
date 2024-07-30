import {
    assign,
    createActor,
    createMachine,
    emit,
    fromCallback,
    fromPromise,   InputFrom,
    log,
    waitFor
} from "xstate";
 

type Creds= { client_id: string, client_secret: string, token_url: string }
export async function fetchToken({input:creds}: {
    input: Creds }) {
     const response = await fetch(`${creds.token_url}?grant_type=client_credentials`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${creds.client_id}:${creds.client_secret}`)}`
        },
        body: JSON.stringify({
            client_id: creds.client_id,
            client_secret: creds.client_secret,
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

export type CredsEvent = {type: 'creds' } & Creds

//token machine to fetch the token if expired, or not available
const tokenMachine = createMachine({
    id: 'token', 
    types: {
        context: {} as {
            token?: string,
            creds?: Creds
        },
        input: {} as {
            creds?: Creds
        }
    },
    initial:'no_creds',
     
    context: ({input}) => ({
        creds: input?.creds
    }),
    
    states: {
        no_creds:{
            on:{
                creds:{
                    target: 'fetch',
                    actions: assign({
                        creds: ({event} ) => event as CredsEvent
                    })
                }
            },
            always: {
                target: 'fetch',
                guard: ({context}) => !!context.creds
            } 
        },
        fetch: {
            invoke: {
                src: fromPromise(fetchToken),
                input: ({context}) => context.creds,
                onDone: {
                    target: 'success',
                    actions: [assign({
                        token: ({event}) => event.output
                    })]
                },
                onError: {
                    target: 'failure', actions: log(({event, context}) => ({
                    ...event,
                    url: context.creds?.token_url
                }))
            }
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
                REFRESH: 'fetch'
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
                RETRY: 'fetch'
            }
        }

    }
})


export const credsFromEnv= {
    get client_id(){return process.env.SAP_CLIENT_ID!},
    get client_secret(){return process.env.SAP_CLIENT_SECRET!},
    get token_url(){return  process.env.SAP_TOKEN_URL!}
}

export function createTokenService(input?: InputFrom<typeof tokenMachine>  ) {
    const actor = createActor(tokenMachine, {
        input
    })
    return {
         actor: actor.start(),
         credentials: (creds: Creds) => actor.send({type:"creds" , ...creds}),
         credentialsFromEnv: () => actor.send({type:"creds" , ...credsFromEnv}),

         accessToken: async () => {
             const {context: {token}} = await waitFor(actor, state => state.matches('success'))
             return token!;
         }
    }
}

export function getAccessToken(env=process.env) {

    return createTokenService({creds:credsFromEnv}).accessToken()
}
 
export default tokenMachine;


export const tokenService = createTokenService( )
