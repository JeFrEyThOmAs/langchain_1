import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";

import {
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import {
  RunnableSequence,
  RunnableLambda,
} from "@langchain/core/runnables";


// ------------------------------------
// STEP 1: LLM
// ------------------------------------

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});


// ------------------------------------
// STEP 2: Prompt Template
// ------------------------------------

const prompt =
  ChatPromptTemplate.fromTemplate(`
Give 5 popular {topic}.

{format_instruction}
`);


// ------------------------------------
// STEP 3: Output Parser
// ------------------------------------

const parser =
  new CommaSeparatedListOutputParser();


// ------------------------------------
// STEP 4: Custom Runnable Function
// ------------------------------------

const makeUpperCase =
  RunnableLambda.from((input) => {

    return input.map(item =>
      item.toUpperCase()
    );

  });


// ------------------------------------
// STEP 5: Runnable Sequence
// ------------------------------------

const chain = RunnableSequence.from([

  // Prompt step
  prompt,

  // LLM step
  llm,

  // Parser step
  parser,

  // Custom JS function step
  makeUpperCase,

]);


// ------------------------------------
// STEP 6: Invoke Chain
// ------------------------------------

const result = await chain.invoke({

  topic: "programming languages",

  format_instruction:
    parser.getFormatInstructions(),

});


// ------------------------------------
// STEP 7: Output
// ------------------------------------

console.log(result);