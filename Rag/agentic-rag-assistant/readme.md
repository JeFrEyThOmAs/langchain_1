# Agentic AI Assistant with LangChain

## Project Overview

This project extends the previous RAG Assistant into an Agentic AI Assistant.

Instead of always using vector search, the AI can decide which tool to use.

The assistant can:

* Retrieve products
* Search products semantically
* Query structured data
* Call multiple tools
* Generate final answers using Gemini

This architecture is much closer to modern production AI systems.

---

# Evolution of the Project

## Version 1 - Basic LLM

```text
User
 ↓
Gemini
 ↓
Answer
```

Problem:

The model only knows information from training data.

It does not know our products.

---

## Version 2 - RAG Assistant

```text
User
 ↓
Retriever
 ↓
Vector Database
 ↓
Gemini
 ↓
Answer
```

Now the assistant can answer questions about products.

Example:

```text
Suggest a gaming phone
```

Flow:

```text
Question
 ↓
Embedding
 ↓
Vector Search
 ↓
Relevant Product
 ↓
Gemini
 ↓
Answer
```

This was our first RAG implementation.

---

## Version 3 - Agentic Assistant

```text
User
 ↓
Gemini Agent
 ↓
Choose Tool
 ↓
Execute Tool
 ↓
Gemini
 ↓
Answer
```

This is the architecture used by many modern AI applications.

---

# Why RAG Alone Is Not Enough

Consider:

```text
Any new products?
```

RAG is not ideal.

Reason:

"new" is not semantic information.

It is structured information.

A database query is more accurate.

---

Another example:

```text
Show Samsung phones under ₹50,000
```

RAG would search embeddings.

A database query is better:

```js
find({
  brand: "Samsung",
  price: { $lt: 50000 }
});
```

Faster.
Cheaper.
More accurate.

---

# The Core Idea

Instead of forcing RAG for every question:

```text
User
 ↓
RAG
 ↓
Answer
```

we now have:

```text
User
 ↓
Agent
 ↓
Choose Best Tool
 ↓
Answer
```

The model becomes a decision maker.

---

# What Is a Tool?

A tool is simply a function the model can call.

Example:

```js
async function getLatestProducts() {
  return products;
}
```

or

```js
async function searchProducts(query) {
  return results;
}
```

The AI decides when to use them.

---

# LangChain Tool Definition

Example:

```js
const getLatestProducts = tool(
  async () => {
    return products;
  },
  {
    name: "get_latest_products",
    description: "Get recent products"
  }
);
```

The description is important.

The LLM reads it and decides whether the tool is useful.

---

# Available Tools

## Tool 1

get_latest_products

Purpose:

Retrieve recently added products.

Used for:

```text
Any new products?

Show latest products.

Recently added items.
```

---

## Tool 2

search_products

Purpose:

Semantic product search.

Used for:

```text
Suggest a gaming phone.

Recommend phones with AI features.

Find products similar to iPhone.
```

---

# Agent Workflow

User asks:

```text
Any new products?
```

Gemini thinks:

```text
Need latest product data.
```

Tool selected:

```text
get_latest_products
```

Tool executes.

Result returned.

Gemini creates final response.

---

# Another Example

User asks:

```text
Suggest a gaming phone.
```

Gemini thinks:

```text
Need semantic search.
```

Tool selected:

```text
search_products
```

Result:

```text
OnePlus 15
Gaming phone with AI features
```

Gemini generates the final answer.

---

# How LangChain Makes This Possible

LangChain provides:

## Tools

```js
tool()
```

Creates callable functions.

---

## Agent

```js
createToolCallingAgent()
```

Creates an AI agent capable of tool selection.

---

## Agent Executor

```js
AgentExecutor()
```

Runs the entire cycle:

```text
Question
 ↓
Tool Selection
 ↓
Tool Execution
 ↓
Answer Generation
```

---

# Why This Is Better Than Previous RAG

## Previous System

```text
User
 ↓
Vector Search
 ↓
Gemini
 ↓
Answer
```

Every question used vector search.

Even when vector search was unnecessary.

---

Problems:

### Structured Queries

Example:

```text
Products under ₹50,000
```

Vector search is not ideal.

---

### Latest Products

Example:

```text
Any new products?
```

Dates should come from a database.

Not embeddings.

---

### Inventory

Example:

```text
Products in stock
```

Should come from a database query.

Not vector search.

---

# New System

```text
User
 ↓
Agent
 ↓
Choose Tool
```

Benefits:

## More Accurate

Uses the correct source of information.

---

## Faster

Avoids unnecessary vector searches.

---

## Cheaper

Fewer embeddings and retrieval operations.

---

## More Scalable

Can add unlimited tools.

Example:

```text
MongoDB Tool

Vector Search Tool

Order Status Tool

Payment Tool

Shipping Tool

Email Tool
```

The agent decides automatically.

---

# Production Architecture

Future version:

```text
Frontend
     ↓
Node.js Backend
     ↓
Gemini Agent
     ↓
Tools

1. MongoDB

2. Qdrant

3. Orders API

4. Payments API

5. Email Service
```

---

# Product Addition Workflow

Admin adds product:

```text
Product
 ↓
MongoDB
 ↓
Embedding Generated
 ↓
Vector Database
```

Now:

Structured data exists in MongoDB.

Semantic data exists in Vector DB.

Agent can use either one.

---

# Current Knowledge Gained

We learned:

* Gemini Integration
* Embeddings
* Vector Databases
* Retrieval
* RAG
* Dynamic Indexing
* Tool Calling
* Function Calling
* Agent Architecture
* LangChain Agents

---

# Final Architecture

```text
User
 ↓
Gemini Agent
 ↓
Decision Making
 ├── MongoDB Tool
 ├── Vector Search Tool
 ├── Orders Tool
 ├── Payments Tool
 └── Other APIs
 ↓
Gemini
 ↓
Final Answer
```

This architecture is significantly closer to how real-world AI assistants are built than a pure RAG system.
