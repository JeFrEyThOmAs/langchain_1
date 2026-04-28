import dotenv from "dotenv"
dotenv.config()
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {PromptTemplate , FewShotPromptTemplate} from "@langchain/core/prompts"

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});

const examples = [
    {
        "input": "The patient is experiencing myocardial infarction characterized by chest pain radiating to the left arm, accompanied by diaphoresis and shortness of breath.",
        "output": "The patient is having a heart attack. This causes chest pain that can spread to the left arm, along with sweating and difficulty breathing.",
    },
    {
        "input": "The individual presents with acute bronchitis, exhibiting persistent cough, mucus production, and mild wheezing.",
        "output": "The person has inflammation in the airways (bronchitis), causing a continuous cough, mucus, and slight breathing difficulty.",
    }
]

const examplePrompt = new PromptTemplate({
    inputVariables: ["input", "output"],
    template: "Input: {input}\nOutput: {output}\n",
});



const prompt = new FewShotPromptTemplate({
    examples,
    examplePrompt,
    suffix: "{myinput}",
    inputVariables: ["myinput"],
})

// internally
// for (const example of examples) {
//     examplePrompt.format({
//       input: example.input,
//       output: example.output,
//     });
//   }

const res = await prompt.format({
    myinput: "The patient is experiencing myocardial infarction characterized by chest pain radiating to the left arm, accompanied by diaphoresis and shortness of breath.",
})

const response = await llm.invoke(res);

console.log(response.content);