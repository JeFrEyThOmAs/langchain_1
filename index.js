import dotenv from "dotenv"
dotenv.config()

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

const response = await llm.invoke([
    new SystemMessage("You are a helpful assistant that explains simply."),
    new HumanMessage("Explain AI in one sentence"),
]);

  console.log(response.content);
// const res = await llm.invoke("Explain AI in one sentence");

// console.log(res.content);

