import {assign, createActor, createMachine, emit, fromCallback, fromPromise, log, waitFor} from "xstate";
import {config} from 'dotenv';

config();

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

    context: {
        token: null,
        creds: {
            clientid: process.env.SAP_CLIENT_ID,
            clientsecret: process.env.SAP_CLIENT_SECRET,
            tokenurl: process.env.SAP_TOKEN_URL
        }
    },
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
                    }) ]
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


const tokenService = createActor(tokenMachine)

export async function getAccessToken(): Promise<string> {
    tokenService.start();

    const {context: {token}} = await waitFor(tokenService, state => state.matches('success'))
    return token!;
}
