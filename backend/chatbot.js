import "dotenv/config";
import Groq from "groq-sdk";
import NodeCache from "node-cache";

import { tavilyWebSearch, calculator } from "./tools.js";

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // Cache for 24 hours (in seconds)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function firstGroqCall(model, temperature, messages, tools) {
  return groq.chat.completions.create({
    model: model,
    temperature: temperature,
    tools: tools,
    tool_choice: "auto", // "auto" -> the model will decide when to use the tool, "manual" -> the model will not use the tool unless explicitly instructed; "define" -> same as "manual" but the model will not use the tool unless explicitly instructed

    messages: messages,
  });
}

export async function chatBot(req, sessionId) {
  const model = "openai/gpt-oss-120b";
  const temperature = 0;
  const systemMessage = {
    role: "system",
    content:
      "Behave as a helpful assistant. Answer concisely. Answer the user in simple plain text. Do not use Markdown, LaTeX, headings, or unnecessary explanations. Give only the final answer.",
  };
  const userMessage = {
    role: "user",
    content: req,
  };
  const tools = [
    {
      type: "function", // type of tool, can be "function" or "api"
      function: {
        name: "tavilyWebSearch",
        // more precise descriptions help the model understand the tool's purpose
        description: "Search the web for latest information and realtime data",
        // parameters are passed into the tool(function or api) as a query
        parameters: {
          type: "object",
          // properties are the actual query parameters that the tool accepts
          properties: {
            query: {
              type: "string",
              description: "The search query",
            },
          },
          required: ["query"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "calculator",
        description: "Perform mathematical calculations",
        parameters: {
          type: "object",
          properties: {
            expression: {
              type: "string",
              description:
                "Calculate mathematical expressions using JavaScript syntax. Use Math functions such as Math.sqrt(), Math.pow(), etc.",
            },
          },
          required: ["expression"],
        },
      },
    },
  ];

  // Get cached conversation if it exists
  const cachedConversation = cache.get(sessionId);
  console.log("Session Id: ", sessionId);
  console.log("Cached conversation:", cachedConversation);
  let messages;
  if (!cachedConversation) {
    messages = [systemMessage, userMessage];
  } else {
    messages = [...cachedConversation, userMessage];
  }

  // Store the complete conversation

  // 1. First LLM call, don't include the cached conversation
  let response = await firstGroqCall(model, temperature, messages, tools);

  let responseMessage = response.choices[0].message; // Add 1st LLM response to conversation

  while (true) {
    // Add LLM response to conversation
    messages.push(responseMessage);

    // No tool call → final answer
    if (!responseMessage.tool_calls?.length) {
      // Save the complete conversation in cache
      console.log("Saved cache: ", cache.set(sessionId, messages));
      return responseMessage.content;
    }

    // Execute all tool calls
    for (const tool_call of responseMessage.tool_calls) {
      const functionName = tool_call.function.name;
      const functionArgs = JSON.parse(tool_call.function.arguments || "{}");

      let toolResult;

      if (functionName === "tavilyWebSearch") {
        console.log("Running toolcall: 'tavilyWebSearch'....");
        toolResult = await tavilyWebSearch(functionArgs);
      } else if (functionName === "calculator") {
        console.log("Running toolcall: 'calculator'....");
        toolResult = calculator(functionArgs.expression);
      }

      // Add tool result to conversation
      messages.push({
        role: "tool",
        tool_call_id: tool_call.id,
        content: JSON.stringify(toolResult),
      });
    }

    // 2. Send tool result back to LLM
    response = await groq.chat.completions.create({
      model,
      temperature,
      messages,

      // Important if LLM may call another tool
      tools: tools,
      tool_choice: "auto",
    });

    responseMessage = response.choices[0].message;
  }
}
