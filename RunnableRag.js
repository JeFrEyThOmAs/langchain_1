import dotenv from "dotenv";
dotenv.config();

import {
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";

import {
  OllamaEmbeddings,
} from "@langchain/ollama";

import {
  MemoryVectorStore,
} from "@langchain/classic/vectorstores/memory";

import {
  RecursiveCharacterTextSplitter,
} from "@langchain/textsplitters";

import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";

import {
  RunnableSequence,
  RunnableLambda,
} from "@langchain/core/runnables";


// ------------------------------------
// STEP 1: LLM
// ------------------------------------

const llm =
  new ChatGoogleGenerativeAI({

    model: "gemini-2.5-flash",

    apiKey:
      process.env.GEMINI_API_KEY,

  });


// ------------------------------------
// STEP 2: YOUR CUSTOM DATA
// ------------------------------------

const text = `

RAG stands for Retrieval
Augmented Generation.

LangChain helps build
AI applications.

Embeddings convert text
into vectors.

Vector databases store
embeddings.

RunnableSequence helps
create AI pipelines.

`;


// ------------------------------------
// STEP 3: SPLIT TEXT
// ------------------------------------

const splitter =
  new RecursiveCharacterTextSplitter({

    chunkSize: 100,

    chunkOverlap: 20,

  });

const docs =
  await splitter.createDocuments([text]);


// ------------------------------------
// STEP 4: EMBEDDINGS
// ------------------------------------

const embeddings =
  new OllamaEmbeddings({

    model: "nomic-embed-text",

  });


// ------------------------------------
// STEP 5: VECTOR STORE
// ------------------------------------

const vectorStore =
  await MemoryVectorStore
    .fromDocuments(
      docs,
      embeddings
    );


// ------------------------------------
// STEP 6: RETRIEVER
// ------------------------------------

const retriever =
  vectorStore.asRetriever();


// ------------------------------------
// STEP 7: PROMPT TEMPLATE
// ------------------------------------

const prompt =
  ChatPromptTemplate.fromTemplate(`

Answer the question
using the context below.

Context:
{context}

Question:
{question}

`);


// ------------------------------------
// STEP 8: FORMAT DOCS
// ------------------------------------

const formatDocs =
  RunnableLambda.from((docs) => {

    return docs
      .map(doc =>
        doc.pageContent
      )
      .join("\n");

  });


// ------------------------------------
// STEP 9: RAG CHAIN
// ------------------------------------

const chain =
  RunnableSequence.from([

    // Create dynamic inputs
    {

      context:
        RunnableSequence.from([

          // Take question
          input => input.question,

          // Retrieve docs
          retriever,

          // Convert docs to text
          formatDocs,

        ]),

      question:
        input => input.question,

    },

    // Prompt
    prompt,

    // LLM
    llm,

  ]);


// ------------------------------------
// STEP 10: INVOKE
// ------------------------------------

const result =
  await chain.invoke({

    question:
      "What is RAG?",

  });


// ------------------------------------
// STEP 11: OUTPUT
// ------------------------------------

console.log("\nAI Answer:\n");

console.log(result.content);