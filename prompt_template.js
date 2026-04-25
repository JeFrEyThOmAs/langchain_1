import dotenv from "dotenv"
dotenv.config()
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {PromptTemplate} from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";



const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

const noInputPrompt = new PromptTemplate({
    template: "Explain about {topic} in {language} in 2 sentence only",
    inputVariables: [ "topic", "language" ],
});
const response = await noInputPrompt.format({
    topic: "array",
    language: "Python",
})

const res = await llm.invoke(response);

console.log(res.content);