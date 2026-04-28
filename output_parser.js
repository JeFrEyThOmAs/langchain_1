import dotenv from "dotenv"
dotenv.config()
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
  } from "@langchain/core/prompts";
  
import {PromptTemplate} from "@langchain/core/prompts"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    // DateTimeOutputParser,
    CommaSeparatedListOutputParser,
    StructuredOutputParser,
  } from "@langchain/core/output_parsers";


// this is now depricated
// const date_time_parser = new DateTimeOutputParser();
// console.log(date_time_parser.getFormatInstructions());


// const comma_sep = new CommaSeparatedListOutputParser()
// console.log(comma_sep.getFormatInstructions())

// const parser = StructuredOutputParser.fromNamesAndDescriptions({
//     date: "A valid ISO datetime string",
//     event: "Name of the event",
// });
  
// console.log(parser.getFormatInstructions());


// now to use it 

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});



const parser = new CommaSeparatedListOutputParser();

// 🔹 Prompts
const systemPrompt = SystemMessagePromptTemplate.fromTemplate(
  "You are a helpful assistant."
);

const humanPrompt = HumanMessagePromptTemplate.fromTemplate(
  `List 5 {category}.

${parser.getFormatInstructions()}`
);

// 🔹 Combine
const chatPrompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  humanPrompt,
]);

async function run() {
  // 🔹 1. Format messages (THIS is what you wanted)
  const messages = await chatPrompt.formatMessages({
    category: "fruits",
  });

  // 🔹 2. Call LLM
  const response = await llm.invoke(messages);

  console.log("RAW:", response.content);

  // 🔹 3. Parse manually
  const parsed = await parser.parse(response.content);

  console.log("PARSED:", parsed);
}

run();