import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  StructuredOutputParser,
} from "@langchain/core/output_parsers";

import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

// 🔹 LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔹 Define structure
const parser = StructuredOutputParser.fromNamesAndDescriptions({
  answer: "Answer to the user's question",
  source: "Website URL used to answer the question",
});

// console.log(parser.getFormatInstructions());

// “Instruction to the LLM”

// You must answer the question in a JSON format.

// The JSON should contain:

// answer → a string that answers the user’s question
// source → a string that is a website URL used for the answer

// Make sure:

// The output is valid JSON
// Both fields are present
// Do not add extra fields
// Do not write anything outside the JSON

// Follow this structure exactly.

// 🔹 Template (NOTICE: no hardcoding)
const template = "{request}\n{format_instructions}";

const humanPrompt = HumanMessagePromptTemplate.fromTemplate(template);

const chatPrompt = ChatPromptTemplate.fromMessages([
  humanPrompt,
]);



async function run() {
  // 🔹 Pass BOTH values dynamically
  const messages = await chatPrompt.formatMessages({
    request: "When was World War 2 declared?",
    format_instructions: parser.getFormatInstructions(), // 👈 passed as variable
  });
//   console.log("-----" , messages)

  // 🔹 Call LLM
  const response = await llm.invoke(messages);

  console.log("RAW:", response.content);

  // 🔹 Parse
  const parsed = await parser.parse(response.content);

  console.log("PARSED:", parsed);
}

run();