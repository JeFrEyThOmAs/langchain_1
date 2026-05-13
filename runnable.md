# RunnableSequence in LangChain

## What is RunnableSequence?

`RunnableSequence` is a LangChain utility used to chain multiple runnable components together where the output of one component automatically becomes the input of the next component.

It helps in building:
- AI workflows
- Chatbots
- RAG systems
- AI pipelines
- Agents

---

# Basic Flow

```text
Input
 ↓
Prompt
 ↓
LLM
 ↓
Parser
 ↓
Custom Function
 ↓
Final Output
```

---

# Syntax

```javascript
const chain = RunnableSequence.from([
   component1,
   component2,
   component3
]);
```

---

# Components That Can Be Passed Inside RunnableSequence

## 1. Prompt Templates

Used for generating prompts dynamically.

### Example

```javascript
import { PromptTemplate }
from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
  "Explain {topic}"
);
```

---

# 2. ChatPromptTemplate

Used for chat-based prompts with:
- system messages
- human messages
- AI messages

### Example

```javascript
import { ChatPromptTemplate }
from "@langchain/core/prompts";

const chatPrompt =
  ChatPromptTemplate.fromMessages([

    [
      "system",
      "You are a helpful teacher"
    ],

    [
      "human",
      "Explain {topic}"
    ]

]);
```

---

# 3. LLM / Chat Models

Used for generating AI responses.

### Example

```javascript
import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

const llm =
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});
```

---

# 4. Output Parsers

Used for structuring AI output.

---

## StringOutputParser

Converts output into plain string.

### Example

```javascript
import { StringOutputParser }
from "@langchain/core/output_parsers";

const parser =
  new StringOutputParser();
```

---

## CommaSeparatedListOutputParser

Converts output into array.

### Example

```javascript
import {
  CommaSeparatedListOutputParser
} from "@langchain/core/output_parsers";

const parser =
  new CommaSeparatedListOutputParser();
```

---

# 5. RunnableLambda

Custom JavaScript function inside the chain.

### Example

```javascript
import {
  RunnableLambda
} from "@langchain/core/runnables";

const upperCase =
  RunnableLambda.from((input) => {

    return input.toUpperCase();

});
```

---

# 6. Retrievers

Used in RAG systems for retrieving relevant documents.

### Example

```javascript
const retriever =
  vectorStore.asRetriever();
```

---

# 7. Vector Stores

Used for storing embeddings.

### Example

```javascript
const vectorStore =
  await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
);
```

---

# 8. Other RunnableSequences

Runnable sequences can also be nested.

### Example

```javascript
const chain1 =
  RunnableSequence.from([...]);

const chain2 =
  RunnableSequence.from([
    chain1,
    parser
]);
```

---

# Full RunnableSequence Example

```javascript
import dotenv from "dotenv";
dotenv.config();

import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

import {
  ChatPromptTemplate
} from "@langchain/core/prompts";

import {
  StringOutputParser
} from "@langchain/core/output_parsers";

import {
  RunnableSequence,
  RunnableLambda
} from "@langchain/core/runnables";


// ------------------------------------
// STEP 1: LLM
// ------------------------------------

const llm =
  new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GEMINI_API_KEY,
});


// ------------------------------------
// STEP 2: Chat Prompt
// ------------------------------------

const chatPrompt =
  ChatPromptTemplate.fromMessages([

    [
      "system",

      `You are a helpful teacher.
       Explain concepts simply.`
    ],

    [
      "human",

      `Explain {topic}
       in {language}
       in 3 short points only.`
    ]

]);


// ------------------------------------
// STEP 3: Output Parser
// ------------------------------------

const parser =
  new StringOutputParser();


// ------------------------------------
// STEP 4: Custom Function
// ------------------------------------

const addEmoji =
  RunnableLambda.from((input) => {

    return `
🔥 AI RESPONSE:

${input}

✅ End
`;

  });


// ------------------------------------
// STEP 5: Runnable Sequence
// ------------------------------------

const chain =
  RunnableSequence.from([

    chatPrompt,
    llm,
    parser,
    addEmoji

]);


// ------------------------------------
// STEP 6: Invoke Chain
// ------------------------------------

const result =
  await chain.invoke({

    topic: "Array",
    language: "JavaScript"

});


// ------------------------------------
// STEP 7: Output
// ------------------------------------

console.log(result);
```

---

# Flow of the Above Example

```text
Input Variables
      ↓
ChatPromptTemplate
(system + human messages)
      ↓
LLM
      ↓
Output Parser
      ↓
Custom Runnable Function
      ↓
Final Output
```

---

# Advantages of RunnableSequence

| Advantage | Meaning |
|---|---|
| Cleaner Code | Less manual handling |
| Modular | Easy to swap components |
| Reusable | Chains can be reused |
| Readable | Workflow easy to understand |
| Scalable | Build large AI systems |

---

# Without RunnableSequence

Manual handling required.

```javascript
const messages =
  await prompt.formatMessages();

const response =
  await llm.invoke(messages);

const parsed =
  await parser.parse(response.content);
```

---

# With RunnableSequence

```javascript
const result =
  await chain.invoke(input);
```

Much cleaner and easier.

---

# Important Understanding

RunnableSequence is NOT only for output parsing.

It is a general-purpose AI workflow pipeline system.

It can chain:
- prompts
- LLMs
- parsers
- retrievers
- vector stores
- tools
- functions
- other chains

---

# Interview Definition

```text
RunnableSequence is a LangChain utility used to chain multiple runnable components together where the output of one component automatically becomes the input of the next component.
```