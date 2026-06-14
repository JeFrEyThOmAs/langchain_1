import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

import { tool } from "@langchain/core/tools";

import {
  ChatGoogleGenerativeAI
} from "@langchain/google-genai";

import {
  createToolCallingAgent,
  AgentExecutor
} from "langchain/agents";

import {
  ChatPromptTemplate
} from "@langchain/core/prompts";

import readline from "readline";


// =====================================
// GEMINI
// =====================================

const llm =
  new ChatGoogleGenerativeAI({

    model: "gemini-2.5-flash",

    apiKey:
      process.env.GEMINI_API_KEY

  });


// =====================================
// MOCK DATABASE
// =====================================

const products = [

  {
    id: 1,
    name: "Samsung S26",
    brand: "Samsung",
    price: 85000,
    stock: 10,
    category: "Phone",
    description:
      "AI powered flagship phone"
  },

  {
    id: 2,
    name: "OnePlus 15",
    brand: "OnePlus",
    price: 65000,
    stock: 5,
    category: "Phone",
    description:
      "Gaming phone with AI features"
  },

  {
    id: 3,
    name: "iPhone 17",
    brand: "Apple",
    price: 99999,
    stock: 7,
    category: "Phone",
    description:
      "Apple flagship phone"
  }

];



const orders = [

  {
    orderId: "ORD123",
    status: "Shipped",
    amount: 65000
  },

  {
    orderId: "ORD456",
    status: "Processing",
    amount: 85000
  }

];



// =====================================
// TOOL 1
// LATEST PRODUCTS
// =====================================

const getLatestProducts = tool(

  async () => {

    return JSON.stringify(products);

  },

  {

    name: "get_latest_products",

    description:
      "Get latest available products",

    schema: z.object({})

  }

);


// =====================================
// TOOL 2
// SEMANTIC PRODUCT SEARCH
// =====================================

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

      query:
        z.string()

    })

  }

);


// =====================================
// TOOL 3
// BRAND SEARCH
// =====================================

const getProductsByBrand = tool(

  async ({ brand }) => {

    const results =
      products.filter(

        product =>
          product.brand
            .toLowerCase() ===
          brand.toLowerCase()

      );

    return JSON.stringify(results);

  },

  {

    name:
      "get_products_by_brand",

    description:
      "Get products by brand",

    schema: z.object({

      brand:
        z.string()

    })

  }

);


// =====================================
// TOOL 4
// PRICE FILTER
// =====================================

const getProductsByPrice = tool(

  async ({ maxPrice }) => {

    const results =
      products.filter(

        product =>
          product.price <= maxPrice

      );

    return JSON.stringify(results);

  },

  {

    name:
      "get_products_by_price",

    description:
      "Find products under a given price",

    schema: z.object({

      maxPrice:
        z.number()

    })

  }

);


// =====================================
// TOOL 5
// TRACK ORDER
// =====================================

const trackOrder = tool(

  async ({ orderId }) => {

    const order =
      orders.find(

        order =>
          order.orderId === orderId

      );

    if (!order) {

      return "Order not found";

    }

    return JSON.stringify(order);

  },

  {

    name:
      "track_order",

    description:
      "Track customer order using order ID",

    schema: z.object({

      orderId:
        z.string()

    })

  }

);


// =====================================
// TOOL 6
// STOCK CHECKER
// =====================================

const getStock = tool(

  async ({ productName }) => {

    const product =
      products.find(

        product =>
          product.name
            .toLowerCase() ===
          productName.toLowerCase()

      );

    if (!product) {

      return "Product not found";

    }

    return JSON.stringify({

      name:
        product.name,

      stock:
        product.stock

    });

  },

  {

    name:
      "get_stock",

    description:
      "Check inventory stock",

    schema: z.object({

      productName:
        z.string()

    })

  }

);


// =====================================
// TOOL 7
// SHIPPING ESTIMATE
// =====================================

const getShippingEstimate = tool(

  async ({ city }) => {

    const estimates = {

      bangalore:
        "2 days",

      mumbai:
        "3 days",

      delhi:
        "4 days"

    };

    return (
      estimates[
        city.toLowerCase()
      ] ||
      "5-7 days"
    );

  },

  {

    name:
      "shipping_estimate",

    description:
      "Get shipping estimate for city",

    schema: z.object({

      city:
        z.string()

    })

  }

);


// =====================================
// TOOL 8
// KNOWLEDGE BASE
// =====================================

const searchKnowledgeBase = tool(

  async ({ query }) => {

    return `
Refunds are available
within 30 days.

Orders can be cancelled
before shipping.

Certificates are not
applicable to products.
`;

  },

  {

    name:
      "search_knowledge_base",

    description:
      "Search FAQs, policies and help docs",

    schema: z.object({

      query:
        z.string()

    })

  }

);


// =====================================
// REGISTER TOOLS
// =====================================

const tools = [

  getLatestProducts,

  searchProducts,

  getProductsByBrand,

  getProductsByPrice,

  trackOrder,

  getStock,

  getShippingEstimate,

  searchKnowledgeBase

];


// =====================================
// PROMPT
// =====================================

const prompt =
  ChatPromptTemplate.fromMessages([

    [

      "system",

      `
You are an AI Shopping Assistant.

Use tools whenever needed.

Always provide concise
and useful responses.

If a tool returns data,
use that data to answer.
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


// =====================================
// AGENT
// =====================================

const agent =
  await createToolCallingAgent({

    llm,

    tools,

    prompt

  });


// =====================================
// EXECUTOR
// =====================================

const executor =
  new AgentExecutor({

    agent,

    tools,

    verbose: true

  });


// =====================================
// CHAT LOOP
// =====================================

const rl =
  readline.createInterface({

    input:
      process.stdin,

    output:
      process.stdout

  });

console.log(
  "\n===== AGENTIC E-COMMERCE ASSISTANT =====\n"
);

function askQuestion() {

  rl.question(

    "You: ",

    async (input) => {

      if (
        input.toLowerCase() ===
        "exit"
      ) {

        console.log(
          "\nGoodbye!\n"
        );

        rl.close();

        return;

      }

      try {

        const response =
          await executor.invoke({

            input

          });

        console.log(
          "\nAssistant:",
          response.output,
          "\n"
        );

      }

      catch (error) {

        console.error(
          error
        );

      }

      askQuestion();

    }

  );

}

askQuestion();