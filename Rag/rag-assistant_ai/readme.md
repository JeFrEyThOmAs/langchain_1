# AI Assistant with RAG - Detailed Notes

## Project Goal

Build an AI assistant that can answer questions about products using RAG (Retrieval Augmented Generation).

Instead of training the LLM whenever a new product is added, we store product information in a vector database and retrieve relevant products at runtime.

---

# High Level Architecture

```text
User Question
      ↓
Embedding Model
      ↓
Vector Search
      ↓
Relevant Products Retrieved
      ↓
Gemini LLM
      ↓
Final Answer
```

For a production application:

```text
Admin Adds Product
      ↓
MongoDB
      ↓
Embedding Model
      ↓
Vector Database

User Question
      ↓
Embedding Model
      ↓
Vector Database Search
      ↓
Retrieved Context
      ↓
Gemini
      ↓
Answer
```

---

# Technologies Used

## LangChain

Used to connect:

* Gemini
* Embeddings
* Vector Store
* Retrieval Pipeline

---

## Gemini

```js
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
});
```

Purpose:

* Generates final responses
* Uses retrieved context to answer questions

Example:

Question:

```text
Do you have any gaming phones?
```

Context:

```text
OnePlus 15
Gaming phone with AI features
```

Gemini generates:

```text
Yes, OnePlus 15 is a gaming phone with AI features.
```

---

## Ollama Embeddings

```js
const embeddings =
  new OllamaEmbeddings({
    model: "nomic-embed-text",
  });
```

Purpose:

Convert text into vectors.

Example:

```text
Gaming Phone
```

becomes

```text
[0.234, -0.11, 0.75, ...]
```

These vectors help find similar information.

---

# Why Embeddings Are Needed

LLMs cannot efficiently search large datasets.

Instead:

```text
Text
 ↓
Embedding Model
 ↓
Vector
 ↓
Vector Search
```

Example:

Product:

```text
OnePlus 15
Gaming phone with AI features
```

Stored as:

```text
[0.12, 0.45, -0.88, ...]
```

User asks:

```text
Suggest a gaming phone
```

Query becomes another vector.

Vector similarity finds matching products.

---

# MemoryVectorStore

```js
const vectorStore =
  await MemoryVectorStore.fromDocuments(
    docs,
    embeddings
  );
```

Purpose:

Stores vectors in memory.

Internally:

```text
Documents
      ↓
Embeddings
      ↓
Vectors
      ↓
Stored in Memory
```

---

# Why Both docs and embeddings Are Passed

```js
MemoryVectorStore.fromDocuments(
  docs,
  embeddings
);
```

The vector store cannot create vectors.

The embedding model creates vectors.

Flow:

```text
docs
 ↓
embedding model
 ↓
vectors
 ↓
vector store
```

Without embeddings:

```text
No vectors
No similarity search
```

---

# Document Creation

Products are converted into text documents.

Example:

```js
{
  name: "OnePlus 15",
  price: 65000,
  description: "Gaming phone"
}
```

becomes:

```text
Name: OnePlus 15
Price: 65000
Description: Gaming phone
```

These become LangChain Documents.

---

# Text Splitting

```js
const splitter =
  new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });
```

Purpose:

Split large documents into smaller chunks.

Example:

```text
Very large product descriptions
```

become

```text
Chunk 1
Chunk 2
Chunk 3
```

This improves retrieval quality.

---

# Product Retrieval

User asks:

```text
Do you have gaming phones?
```

LangChain:

```js
const retrievedDocs =
  await vectorStore.similaritySearch(
    question,
    2
  );
```

Process:

```text
Question
      ↓
Embedding
      ↓
Vector Search
      ↓
Top Matching Documents
```

Example Result:

```text
OnePlus 15
Gaming phone with AI features
```

---

# Building Context

Retrieved documents are combined.

```js
const context =
  retrievedDocs
    .map(doc => doc.pageContent)
    .join("\n");
```

Example:

```text
Name: OnePlus 15
Price: 65000

Name: Samsung S26
Price: 85000
```

This becomes the context sent to Gemini.

---

# Prompt Construction

```js
const prompt = `
Context:
${context}

Question:
${question}
`;
```

Example:

```text
Context:
OnePlus 15
Gaming phone

Question:
Suggest a gaming phone
```

---

# Final Response Generation

```js
const response =
  await llm.invoke(prompt);
```

Gemini receives:

* Question
* Retrieved Context

and generates:

```text
OnePlus 15 is a good gaming phone because it includes AI features.
```

---

# Dynamic Product Addition

We learned how to add products after startup.

Example:

```js
await vectorStore.addDocuments([
  {
    pageContent: `
      Name: OnePlus 15
      Price: 65000
      Description: Gaming phone
    `
  }
]);
```

Result:

```text
New Product Added
      ↓
Embedded
      ↓
Stored in Vector DB
      ↓
Immediately Searchable
```

No need to recreate the vector store.

---

# Limitation of MemoryVectorStore

Current setup:

```js
MemoryVectorStore
```

Problem:

```text
Application Stops
       ↓
All Data Lost
```

Because everything is stored in RAM.

---

# Production Architecture

Replace:

```js
MemoryVectorStore
```

with:

* Qdrant
* Chroma
* Pinecone

Flow:

```text
Product Added
      ↓
MongoDB
      ↓
Embedding Generated
      ↓
Vector Database
```

Data persists after server restarts.

---

# MongoDB + Vector DB

Recommended architecture:

```text
MongoDB
      ↓
Stores Product Data

Vector Database
      ↓
Stores Product Embeddings

Gemini
      ↓
Generates Answers
```

MongoDB stores:

```json
{
  "name": "OnePlus 15",
  "price": 65000
}
```

Vector DB stores:

```text
Vector Representation
```

---

# Which Questions Should Use RAG?

Good RAG Questions:

```text
Suggest a gaming phone

Recommend a laptop for coding

Which products have AI features?
```

Reason:

These require semantic search.

---

# Which Questions Should Use MongoDB?

Better handled using database queries:

```text
Any new products?

How many phones are in stock?

Products under ₹50,000

Show all Samsung phones
```

Reason:

These are structured queries.

---

# Final Learning Summary

We learned:

1. What RAG is.
2. How embeddings work.
3. Why vector databases are needed.
4. How LangChain retrieves relevant documents.
5. How Gemini uses retrieved context.
6. How to dynamically add products.
7. Why MemoryVectorStore is temporary.
8. Why production systems use MongoDB + Vector DB.
9. When to use RAG and when to use database queries.
10. How modern AI assistants are built.

Final Architecture:

```text
Frontend
     ↓
Node.js
     ↓
MongoDB
     ↓
Embedding Model
     ↓
Vector Database
     ↓
Retriever
     ↓
Gemini
     ↓
Answer
```
