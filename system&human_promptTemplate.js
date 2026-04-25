import dotenv from "dotenv";
dotenv.config();

import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔹 System template
const systemPrompt = SystemMessagePromptTemplate.fromTemplate(
  "You are a helpful assistant who explains {topic} simply in {language}."
);

// 🔹 Human template
const humanPrompt = HumanMessagePromptTemplate.fromTemplate(
  "Explain {topic} in {language} in 2 sentences only."
);

// 🔹 Combine them
const chatPrompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  humanPrompt,
]);

// 🔹 Create pipeline
const chain = chatPrompt.pipe(llm);

// 🔹 Run
const res = await chain.invoke({
  topic: "array",
  language: "Python",
});

console.log(res.content);