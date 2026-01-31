import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import readline from 'node:readline/promises';

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const messages = [
        {
            role: 'system',
            content: `You are Jarvis  a smart personal assistant. Be always polite.
            you have the following tools:
            1. searchweb({query}): {query: string}) // search the latest information and realtime data
            on the internet.
            current date and time: ${new Date().toUTCString()}`,
        },
    ];

    while (true) {

        const question = await rl.question('you:');
        if (question == 'bye') {
            break;
        }

        messages.push({
            role: 'user',
            content: question,
        });

        while (true) {

            let completions = await groq.chat.completions.create({
                temperature: 0,
                model: 'llama-3.3-70b-versatile',
                messages: messages,
                tools: [
                    {
                        type: "function",
                        function: {
                            name: "websearch",
                            description: "Get current weather for a location",
                            parameters: {
                                type: "object",
                                properties: {
                                    query: {
                                        type: "string",
                                        description: "City and state, e.g. San Francisco, CA"
                                    },
                                },
                                required: ["query"]
                            }
                        }
                    }
                ],
                tool_choice: 'auto',
            });

            messages.push(completions.choices[0].message);

            const toolcalls = completions.choices[0].message.tool_calls;

            if (!toolcalls) {
                console.log(`Assistant: ${completions.choices[0].message.content}`);
                break;
            }

            for (const tool of toolcalls) {
                console.log('tool: ', tool);

                const functionName = tool.function.name;
                const functionparams = tool.function.arguments;

                if (functionName == 'websearch') {
                    const toolresult = await websearch(JSON.parse(functionparams));
                    console.log("Tool result: ", toolresult);

                    messages.push({
                        tool_call_id: tool.id,
                        role: 'tool',
                        name: functionName,
                        content: toolresult,
                    });
                }
            }
        }
    }

    rl.close();
}

main();

async function websearch({ query }) {

    console.log("calling web search...");

    const response = await tvly.search(query);
    console.log('Response:', response);

    const finalresult = response.results.map((result) => result.content).join('\n\n');

    return finalresult;
}
