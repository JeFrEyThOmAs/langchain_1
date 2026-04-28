import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

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
  
  const human_template = `
  {request}
  
  {format_instruction}
  `;
  
  const human_message_prompt =
    HumanMessagePromptTemplate.fromTemplate(human_template);
  
  const chat_prompt = ChatPromptTemplate.fromMessages([
    human_message_prompt,
  ]);
  
  const formatted_chat_prompt = await chat_prompt.formatMessages({
    request: "List 5 fruits",
    format_instruction: parser.getFormatInstructions(),
  });
  
  console.log(formatted_chat_prompt);

// const response = await llm.invoke(formatted_chat_prompt);

// const parsed = await parser.parse(response.content);

// console.log(parsed);