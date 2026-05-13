import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { OllamaEmbeddings } from "@langchain/ollama";


// -----------------------------
// STEP 1: LLM
// -----------------------------

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


// -----------------------------
// STEP 2: Your custom data
// -----------------------------

const text = `
RAG stands for Retrieval Augmented Generation.
LangChain helps build AI applications.
Embeddings convert text into vectors.
Vector databases store embeddings.
`;


// -----------------------------
// STEP 3: Split text into chunks
// -----------------------------

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const docs = await splitter.createDocuments([text]);


// -----------------------------
// STEP 4: Gemini Embeddings
// -----------------------------

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
});


// -----------------------------
// STEP 5: Create Vector DB
// -----------------------------

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  embeddings
);

console.log("Vector DB ready");


// -----------------------------
// STEP 6: Ask Question
// -----------------------------

const question = "What is RAG?";


// -----------------------------
// STEP 7: Retrieve relevant docs
// -----------------------------

const retrievedDocs = await vectorStore.similaritySearch(
  question,
  2
);

const context = retrievedDocs
  .map(doc => doc.pageContent)
  .join("\n");

console.log("\nRetrieved Context:\n");
console.log(context);


// -----------------------------
// STEP 8: Final Prompt
// -----------------------------

const prompt = `
Answer the question using the context below.

Context:
${context}

Question:
${question}
`;


// -----------------------------
// STEP 9: Generate Answer
// -----------------------------

const response = await llm.invoke(prompt);

console.log("\nAI Answer:\n");
console.log(response.content);