# 🧠 LangChain Output Parsers (JavaScript)

A simple guide to understanding and using **Output Parsers** in LangChain with modern JS setup.

---

## 🚀 What is an Output Parser?

An **Output Parser** helps you:

1. ✅ Tell the LLM how to format its output (**before execution**)  
2. ✅ Convert the LLM output into structured data (**after execution**)

👉 It works as both:
- 📝 **Prompt helper**
- 🔄 **Post-processor**

---

## 🔥 Core Flow

Prompt ─────► LLM ─────► Raw Output ─────► Parsed Output
↑ ↓
format instructions parser.parse()