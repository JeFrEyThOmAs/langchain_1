import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { OllamaEmbeddings } from "@langchain/ollama";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


// ------------------------------------
// STEP 1: LLM
// ------------------------------------

const llm =
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
  });


// ------------------------------------
// STEP 2: EMBEDDINGS
// ------------------------------------

const embeddings =
  new OllamaEmbeddings({
    model: "nomic-embed-text",
  });


// ------------------------------------
// STEP 3: INITIAL PRODUCTS
// ------------------------------------

const products = [

  {
    name: "iPhone 17",
    price: 99999,
    description: "Apple flagship phone"
  },

  {
    name: "Samsung S26",
    price: 85000,
    description: "AI powered Samsung phone"
  }

];


// ------------------------------------
// STEP 4: CONVERT PRODUCTS TO DOCS
// ------------------------------------

const splitter =
  new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

const productTexts =
  products.map(product => `
    Name: ${product.name}
    Price: ${product.price}
    Description: ${product.description}
  `);

const docs =
  await splitter.createDocuments(
    productTexts
  );


// ------------------------------------
// STEP 5: CREATE VECTOR DB
// ------------------------------------

const vectorStore =
  await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
  );

console.log("Vector DB Ready");


// ------------------------------------
// STEP 6: ADD NEW PRODUCT
// ------------------------------------

async function addProduct(product) {

  const newDoc = {
    pageContent: `
      Name: ${product.name}
      Price: ${product.price}
      Description: ${product.description}
    `
  };

  await vectorStore.addDocuments([
    newDoc
  ]);

  console.log(
    `Added Product: ${product.name}`
  );
}


// ------------------------------------
// STEP 7: SIMULATE ADMIN ADDING PRODUCT
// ------------------------------------

await addProduct({

  name: "OnePlus 15",

  price: 65000,

  description:
    "Gaming phone with AI features"

});


// ------------------------------------
// STEP 8: USER QUESTION
// ------------------------------------

const question =
  "Do you have any gaming phones?";


// ------------------------------------
// STEP 9: RETRIEVE RELEVANT DOCS
// ------------------------------------

const retrievedDocs =
  await vectorStore.similaritySearch(
    question,
    2
  );

const context =
  retrievedDocs
    .map(doc => doc.pageContent)
    .join("\n");

console.log("\nRetrieved Context:\n");
console.log(context);


// ------------------------------------
// STEP 10: CREATE PROMPT
// ------------------------------------

const prompt = `
You are a helpful shopping assistant.

Answer using only the context below.

Context:
${context}

Question:
${question}

Answer:
`;


// ------------------------------------
// STEP 11: GENERATE ANSWER
// ------------------------------------

const response =
  await llm.invoke(prompt);

console.log("\nAI Answer:\n");
console.log(response.content);