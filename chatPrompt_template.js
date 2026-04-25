import dotenv from "dotenv";
dotenv.config();

import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});

// 👇 define templates separately (like in your screenshot)
const sys_template =
  "You are a helpful assistant that explains {topic} simply in {language2}";

const human_template =
  "Explain {topic} in {language} in 2 sentences only";

// 👇 THIS is the method you want
const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", sys_template],
  ["human", human_template],
]);

// format messages
const messages = await chatPrompt.formatMessages({
  language2: "hindi",
  topic: "array",
  language: "Python",
});

console.log(messages)
// call LLM
const res = await llm.invoke(messages);

console.log(res.content);