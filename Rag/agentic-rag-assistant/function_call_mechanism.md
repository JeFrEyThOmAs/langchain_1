# How AI Agents Decide Which Function To Call

## Introduction

Traditional chatbots only generate text.

Example:

```text
User
 ↓
LLM
 ↓
Response
```

The model cannot:

* Query databases
* Check order status
* Search products
* Call APIs

It can only generate text.

---

# The Problem

Imagine a user asks:

```text
Track my order ORD123
```

A normal LLM cannot access MongoDB.

It cannot execute:

```js
db.orders.findOne(...)
```

because the model has no direct access to your systems.

---

# The Solution: Tool Calling

Instead of giving the AI direct database access, we provide tools.

Example:

```js
trackOrder(orderId)
```

The AI can request:

```text
Please run this function.
```

Your application executes it safely.

---

# High Level Architecture

```text
User
 ↓
AI Agent
 ↓
Choose Tool
 ↓
Execute Tool
 ↓
Get Result
 ↓
Generate Response
```

---

# What The AI Actually Sees

Suppose we define:

```js
const trackOrder = tool(
  async ({ orderId }) => {},
  {
    name: "track_order",
    description:
      "Track an order using order ID",

    schema: z.object({
      orderId: z.string()
    })
  }
);
```

The AI does NOT see our database.

The AI sees:

```text
Tool Name:
track_order

Description:
Track an order using order ID

Arguments:
{
  orderId: string
}
```

That's all.

---

# The Three Things The AI Uses

The AI decides using:

1. Tool Name
2. Tool Description
3. Tool Schema

---

# Tool Name

Example:

```text
track_order
```

This gives a hint.

The AI learns:

```text
Probably related to orders.
```

---

# Tool Description

Example:

```text
Track an order using order ID.
```

This is extremely important.

The description tells the AI:

```text
When should I use this tool?
```

Think of descriptions as instructions for the model.

---

# Tool Schema

Example:

```js
schema: z.object({
  orderId: z.string()
})
```

The schema tells the AI:

```text
This tool requires:

{
  orderId: string
}
```

Now the model knows what arguments it must provide.

---

# Example 1: Order Tracking

Available Tool:

```text
track_order

Description:
Track an order using order ID

Parameters:
{
  orderId: string
}
```

User:

```text
Track my order ORD123
```

AI reasoning:

```text
User wants order information.

I have a tool called track_order.

It needs orderId.

The user provided ORD123.

Use the tool.
```

Generated Tool Call:

```json
{
  "orderId": "ORD123"
}
```

---

# What Happens Next

LangChain executes:

```js
trackOrder({
  orderId: "ORD123"
});
```

Inside the tool:

```js
const order =
  await ordersCollection.findOne({
    orderId: "ORD123"
  });
```

MongoDB returns:

```json
{
  "orderId": "ORD123",
  "status": "Shipped"
}
```

Tool returns result.

The AI receives:

```json
{
  "orderId": "ORD123",
  "status": "Shipped"
}
```

Final Response:

```text
Your order ORD123 has been shipped.
```

---

# Example 2: Product Recommendation

Available Tool:

```text
search_products

Description:
Search products using natural language.
```

User:

```text
Suggest a gaming phone.
```

AI reasoning:

```text
Need product recommendations.

search_products is relevant.

Use the tool.
```

Tool Call:

```json
{
  "query": "gaming phone"
}
```

---

# Example 3: Price Filtering

Available Tool:

```text
get_products_by_price

Description:
Find products below a maximum price.

Schema:

{
  query: string,
  maxPrice: number
}
```

User:

```text
Suggest a gaming phone under ₹50,000
```

AI reasoning:

```text
Need product recommendations.

Need price filtering.

Use get_products_by_price.
```

Tool Call:

```json
{
  "query": "gaming phone",
  "maxPrice": 50000
}
```

Notice:

The user never explicitly provided:

```json
{
  "query": "gaming phone",
  "maxPrice": 50000
}
```

The AI extracted those values from natural language.

---

# How The AI Extracts Parameters

User:

```text
Show Samsung phones under 40000
```

Tool Schema:

```js
{
  brand: string,
  maxPrice: number
}
```

AI converts:

```text
Show Samsung phones under 40000
```

into:

```json
{
  "brand": "Samsung",
  "maxPrice": 40000
}
```

This process is called:

```text
Argument Extraction
```

or

```text
Parameter Extraction
```

---

# The AI Does Not Know Your Database

Many beginners assume:

```text
The AI can see MongoDB.
```

False.

The AI only knows what you expose.

Database:

```js
{
  orderId,
  customerName,
  amount,
  status
}
```

Tool Schema:

```js
{
  orderId: string
}
```

The AI only knows:

```text
orderId
```

It does not know:

```text
customerName
amount
status
```

unless you expose them.

---

# Why This Is Secure

Bad Architecture:

```text
LLM
 ↓
Database
```

Dangerous.

The AI could potentially generate harmful queries.

---

Good Architecture:

```text
LLM
 ↓
Tool
 ↓
Database
```

The AI can only do what your tools allow.

This is how production systems are designed.

---

# Multiple Tool Selection

Suppose we have:

1. track_order()
2. search_products()
3. get_latest_products()
4. send_email()

User:

```text
Track order ORD123
```

Agent:

```text
Use track_order
```

---

User:

```text
Suggest a gaming phone
```

Agent:

```text
Use search_products
```

---

User:

```text
Any new products?
```

Agent:

```text
Use get_latest_products
```

---

User:

```text
Email this invoice to me
```

Agent:

```text
Use send_email
```

---

# How The Agent Chooses

The agent effectively performs:

```text
Understand User Intent
        ↓
Look At Available Tools
        ↓
Find Best Matching Tool
        ↓
Extract Parameters
        ↓
Call Tool
        ↓
Receive Result
        ↓
Generate Final Answer
```

---

# Why Agents Are Better Than Pure RAG

Pure RAG:

```text
User
 ↓
Vector Search
 ↓
LLM
```

Every question uses vector search.

Even when unnecessary.

---

Agentic Architecture:

```text
User
 ↓
Agent
 ↓
Choose Best Tool
 ↓
Answer
```

Benefits:

* More accurate
* More scalable
* Cheaper
* Faster
* Easier to extend

---

# Real Industry Architecture

Modern AI systems often look like:

```text
User
 ↓
Gemini / GPT Agent
 ↓
Tools

MongoDB Tool

Vector Search Tool

Order Tool

Payment Tool

Email Tool

Shipping Tool

Analytics Tool

External APIs
```

The AI acts like a smart coordinator.

It understands the request, selects the right tool, extracts arguments, executes the tool, and generates the final response.

This pattern is called:

* Tool Calling
* Function Calling
* Agentic AI
* AI Agents

and is one of the most important concepts in modern AI application development.
