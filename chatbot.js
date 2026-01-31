import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import NodeCache from 'node-cache';

// Initialize APIs
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Cache for conversation memory (24 hours)
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });

export async function generate(usermessage, threadid) {

    // Base system prompt
    const basemessages = [
        {
            role: 'system',
            content: `You are Jarvis, a smart personal assistant. Be always polite.

You have the following tool:
- websearch({ query: string })

When you decide to use a tool, respond ONLY with a tool call.
Do not add any text outside the tool call.

Current date and time: ${new Date().toUTCString()}`
        }
    ];

    // Load conversation memory safely
    const messages = cache.get(threadid) ?? [...basemessages];

    // Add user message
    messages.push({
        role: 'user',
        content: usermessage,
    });

    const max_retries = 10;
    let count = 0;

    while (count < max_retries) {
        count++;

        // Call Groq LLM
        const completions = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            temperature: 0,
            messages,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "websearch",
                        description: "Search the internet for real-time information",
                        parameters: {
                            type: "object",
                            properties: {
                                query: {
                                    type: "string",
                                    description: "Search query"
                                }
                            },
                            required: ["query"]
                        }
                    }
                }
            ],
            tool_choice: 'auto',
        });

        const assistantMessage = completions.choices[0].message;
        messages.push(assistantMessage);

        const toolcalls = assistantMessage.tool_calls;

        // If no tool call, return final answer
        if (!toolcalls) {
            cache.set(threadid, messages);
            return assistantMessage.content;
        }

        // Handle tool calls
        for (const tool of toolcalls) {
            const functionName = tool.function.name;
            const functionParams = JSON.parse(tool.function.arguments);

            if (functionName === 'websearch') {
                const toolResult = await websearch(functionParams);

                messages.push({
                    tool_call_id: tool.id,
                    role: 'tool',
                    name: functionName,
                    content: toolResult,
                });
            }
        }
    }

    return "I could not find the result. Please try again.";
}

// Web search tool
async function websearch({ query }) {
    console.log("Calling web search...");

    const response = await tvly.search(query);
    return response.results.map(r => r.content).join('\n\n');
}
