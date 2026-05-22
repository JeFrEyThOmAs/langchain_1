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

import readline from "readline";


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
// STEP 2: COURSE DATA
// ------------------------------------

const text = `

Our institute offers
Full Stack Development,
DevOps, and Generative AI courses.

Full Stack course includes:
HTML, CSS, JavaScript,
React, Node.js, and MongoDB.

DevOps course includes:
Docker, Kubernetes,
Jenkins, AWS, and CI/CD.

Generative AI course includes:
LangChain, RAG,
Vector Databases,
Prompt Engineering,
and LLM Applications.

Course duration is 3 months.

Course fee is 5000 rupees.

Classes are available
both online and offline.

Certificates are provided
after course completion.

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

You are a helpful
course assistant chatbot.

Answer the user's question
using the context below.

Context:
{context}

Question:
{question}

Answer:

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
// STEP 9: CREATE RAG CHAIN
// ------------------------------------

const chain =
  RunnableSequence.from([

    {

      context:
        RunnableSequence.from([

          input => input.question,

          retriever,

          formatDocs,

        ]),

      question:
        input => input.question,

    },

    prompt,

    llm,

  ]);


// ------------------------------------
// STEP 10: CHATBOT LOOP
// ------------------------------------

const rl = readline.createInterface({

  input: process.stdin,

  output: process.stdout,

});

console.log("\n===== COURSE CHATBOT =====");
console.log("Type 'exit' to stop\n");

function askQuestion() {

  rl.question("You: ", async (userInput) => {

    if (
      userInput.toLowerCase() === "exit"
    ) {

      console.log("\nBot: Goodbye!");
      rl.close();
      return;

    }

    const result =
      await chain.invoke({

        question: userInput,

      });

    console.log(
      "\nBot:",
      result.content,
      "\n"
    );

    askQuestion();

  });

}

askQuestion();