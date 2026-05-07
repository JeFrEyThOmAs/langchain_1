import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { OllamaEmbeddings } from "@langchain/ollama";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";


// ----------------------
// Gemini LLM
// ----------------------

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


// ----------------------
// Local Embeddings
// ----------------------

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
});


// ----------------------
// Your Custom Knowledge
// ----------------------

const text = `
RAG stands for Retrieval Augmented Generation.

LangChain is a framework used for building AI applications.

Embeddings convert text into vectors.

Vector databases store embeddings for semantic search.

Ollama allows running AI models locally.
`;


// ----------------------
// Split text into chunks
// ----------------------

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 100,
  chunkOverlap: 20,
});

const docs = await splitter.createDocuments([text]);

console.log("\nChunks:\n");

console.log(docs);


// ----------------------
// Create Vector DB
// ----------------------

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  embeddings
);

console.log("\nVector DB Ready");


// ----------------------
// Ask Question
// ----------------------

const question = "What is RAG?";


// ----------------------
// Retrieve Similar Chunks
// ----------------------

const retrievedDocs = await vectorStore.similaritySearch(
  question,
  2
);

console.log("\nRetrieved Docs:\n");

console.log(retrievedDocs);


// ----------------------
// Build Context
// ----------------------

const context = retrievedDocs
  .map(doc => doc.pageContent)
  .join("\n");


// ----------------------
// Final Prompt
// ----------------------

const prompt = `
Answer the question using the context below.

Context:
${context}

Question:
${question}
`;


// ----------------------
// Gemini Answer
// ----------------------

const response = await llm.invoke(prompt);

console.log("\nAI Answer:\n");

console.log(response.content);