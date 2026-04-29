import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

import {
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

// 🔹 Initialize parser
const parser = new CommaSeparatedListOutputParser();

// 🔹 Initialize LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔹 Load your file
const loader = new TextLoader("./example.txt");
const docs = await loader.load();

// Combine all text
const notes = docs.map(doc => doc.pageContent).join("\n");

// 🔹 Prompt template
const human_template = `
You are given notes below:

----------------
{notes}
----------------

Answer the question based ONLY on these notes.

Question: {request}

{format_instruction}
`;

const human_message_prompt =
  HumanMessagePromptTemplate.fromTemplate(human_template);

const chat_prompt = ChatPromptTemplate.fromMessages([
  human_message_prompt,
]);

// 🔹 Format prompt
const formatted_chat_prompt = await chat_prompt.formatMessages({
  notes: notes,
  request: "Explain RAG in 5 simple points",
  format_instruction: parser.getFormatInstructions(),
});

// 🔹 Call LLM
const response = await llm.invoke(formatted_chat_prompt);

// 🔹 Parse output
const parsed = await parser.parse(response.content);

// 🔹 Output
console.log("RAW RESPONSE:\n", response.content);
console.log("\nPARSED OUTPUT:\n", parsed);