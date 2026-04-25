# 🧠 LangChain Prompt Templates – Complete Guide

## 📌 What is a Prompt Template?

A **Prompt Template** is a reusable structure for creating prompts where some parts are dynamic.

👉 Instead of writing static prompts every time, you define a template with variables.

```
Explain {topic} in {language}
```

---

## 🔹 Types of Prompt Templates

### 1. PromptTemplate (Basic)

* Works with plain text
* No roles (system/human)

```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = new PromptTemplate({
  template: "Explain {topic} in {language}",
  inputVariables: ["topic", "language"],
});

const formatted = await prompt.format({
  topic: "array",
  language: "Python",
});
```

---

### 2. ChatPromptTemplate (Modern / Recommended)

* Used for chat models (Gemini, GPT)
* Supports roles like system & human

```js
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["human", "Explain {topic} in {language}"],
]);
```

---

### 3. MessagePromptTemplate (Advanced)

* Explicit and reusable
* More control in large apps

```js
import {
  ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";

const systemPrompt = SystemMessagePromptTemplate.fromTemplate(
  "You are a helpful assistant"
);

const humanPrompt = HumanMessagePromptTemplate.fromTemplate(
  "Explain {topic} in {language}"
);

const chatPrompt = ChatPromptTemplate.fromMessages([
  systemPrompt,
  humanPrompt,
]);
```

---

## 🔁 Running the Prompt

### Option 1: Using Pipeline (Recommended)

```js
const chain = chatPrompt.pipe(llm);

const res = await chain.invoke({
  topic: "array",
  language: "Python",
});
```

---

### Option 2: Manual Format + Invoke

```js
const messages = await chatPrompt.formatMessages({
  topic: "array",
  language: "Python",
});

const res = await llm.invoke(messages);
```

---

## ⚡ Pipeline Concept

A pipeline means chaining steps:

```
User Input → Prompt → LLM → Output
```

LangChain helps connect these steps cleanly.

---

## 🧠 System vs Human Prompt

| Type   | Purpose               |
| ------ | --------------------- |
| System | Defines behavior/tone |
| Human  | Actual question       |

Example:

```
System: You are a helpful assistant
Human: Explain arrays in Python
```

---

## 🔥 Best Practices

* Use **PromptTemplate** → simple cases
* Use **ChatPromptTemplate** → most real apps
* Use **MessagePromptTemplate** → scalable systems
* Use **pipe()** → production pipelines
* Use **formatMessages()** → debugging

---

## 💡 Key Takeaways

* Prompt templates make prompts reusable
* ChatPromptTemplate is best for modern LLMs
* System = behavior, Human = query
* Pipeline = chaining steps together

---

## 🚀 Where this is used

* Chatbots
* AI assistants
* RAG systems (Tavily + LLM)
* Backend AI APIs

---

## 🧠 One-line Summary

> Prompt Templates help you structure, reuse, and scale prompts when working with LLMs.
