import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

import { tool } from "@langchain/core/tools";

import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

import {
  createToolCallingAgent,
  AgentExecutor
} from "langchain/agents";

import {
  ChatPromptTemplate
} from "@langchain/core/prompts";


// ----------------------------------
// GEMINI
// ----------------------------------

const llm =
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey:
      process.env.GEMINI_API_KEY,
  });


// ----------------------------------
// MOCK DATABASE
// ----------------------------------

const products = [

  {
    name: "Samsung S26",
    price: 85000,
    description:
      "AI powered flagship phone"
  },

  {
    name: "OnePlus 15",
    price: 65000,
    description:
      "Gaming phone with AI features"
  },

  {
    name: "iPhone 17",
    price: 99999,
    description:
      "Apple flagship phone"
  }

];


// ----------------------------------
// TOOL 1
// LATEST PRODUCTS
// ----------------------------------

const getLatestProducts = tool(

  async () => {

    return JSON.stringify(products);

  },

  {
    name: "get_latest_products",

    description:
      "Get recently added products",

    schema: z.object({})
  }

);


// ----------------------------------
// TOOL 2
// SEMANTIC PRODUCT SEARCH
// ----------------------------------

const searchProducts = tool(

  async ({ query }) => {

    const results =
      products.filter(product =>
        product.description
          .toLowerCase()
          .includes(
            query.toLowerCase()
          )
      );

    return JSON.stringify(results);

  },

  {
    name: "search_products",

    description:
      "Search products using natural language",

    schema: z.object({
      query: z.string()
    })
  }

);


// ----------------------------------
// TOOLS
// ----------------------------------

const tools = [
  getLatestProducts,
  searchProducts
];


// ----------------------------------
// PROMPT
// ----------------------------------

const prompt =
  ChatPromptTemplate.fromMessages([

    [
      "system",
      `
      You are an AI shopping assistant.

      Use tools whenever needed.

      Answer naturally.
      `
    ],

    [
      "human",
      "{input}"
    ],

    [
      "placeholder",
      "{agent_scratchpad}"
    ]

  ]);


// ----------------------------------
// AGENT
// ----------------------------------

const agent =
  await createToolCallingAgent({

    llm,

    tools,

    prompt

  });


// ----------------------------------
// EXECUTOR
// ----------------------------------

const executor =
  new AgentExecutor({

    agent,

    tools

  });


// ----------------------------------
// ASK QUESTIONS
// ----------------------------------

const response1 =
  await executor.invoke({

    input:
      "Any new products?"

  });

console.log(
  "\nQUESTION:",
  "Any new products?"
);

console.log(
  "\nANSWER:",
  response1.output
);



const response2 =
  await executor.invoke({

    input:
      "Suggest a gaming phone"

  });

console.log(
  "\nQUESTION:",
  "Suggest a gaming phone"
);

console.log(
  "\nANSWER:",
  response2.output
);