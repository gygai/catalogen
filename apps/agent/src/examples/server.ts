#!/usr/bin/env ts-node
import { openai } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import * as readline from 'node:readline/promises';
import {openaiGP4o} from "../providers/openai.js";
import { tokenService  } from '../providers/sap-token.js';
import {config} from 'dotenv';
config()

const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const messages: CoreMessage[] = [];

async function main() {
    tokenService.credentialsFromEnv();

    while (true) {
        const userInput = await terminal.question('You: ');

        messages.push({ role: 'user', content: userInput });

        const result = await streamText({
            model: openaiGP4o(),
            system: `You are a helpful, respectful and honest assistant.`,
            messages,
        });

        let fullResponse = '';
        process.stdout.write('\nAssistant: ');
        for await (const delta of result.textStream) {
            fullResponse += delta;
            process.stdout.write(delta);
        }
        process.stdout.write('\n\n');

        messages.push({ role: 'assistant', content: fullResponse });
    }
}

main().catch(console.error);