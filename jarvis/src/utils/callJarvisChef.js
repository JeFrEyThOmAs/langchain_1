import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
} from "@langchain/core/prompts";



export const askJarvisChef = async(recipeMessage) => {

    const KEY = import.meta.env.VITE_GEMINI_API_KEY

    const chat = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        apiKey: KEY,
    });
    const systemMessagePrompt = SystemMessagePromptTemplate.fromTemplate("You are a jarvis. You are a master chef so first introduce yourself as Jarvis the master chef. You can write any type of food recipe which can be made in 5 minutes. You are only allowed to answer food related queries. If you don't know the answer just tell them I don't know the answer.")

    const humanMessagePrompt = HumanMessagePromptTemplate.fromTemplate("{asked_message}")

    const chatPrompt = ChatPromptTemplate.fromMessages([
        systemMessagePrompt,
        humanMessagePrompt,
    ]);

    const formatMessages = await chatPrompt.formatMessages({
        asked_message: recipeMessage,
    });

    // console.log("Formatted Messages", formatMessages)
    const response = await chat.invoke(formatMessages);
    return response.content
}