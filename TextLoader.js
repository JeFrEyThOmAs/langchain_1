import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import {
    CommaSeparatedListOutputParser,
  } from "@langchain/core/output_parsers";
  import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
  } from "@langchain/core/prompts";
  const parser = new CommaSeparatedListOutputParser();

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

// Example 1 

const loader = new TextLoader("example.txt");

const docs = await loader.load();
console.log(docs[0].pageContent);

