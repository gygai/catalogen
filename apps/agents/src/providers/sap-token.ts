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
    const {access_token} = await response.json();
    return access_token
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