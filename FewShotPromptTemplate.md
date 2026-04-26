# 🧠 Few-Shot Prompt Template – Complete Flow Explained

This README explains step-by-step what happens in your code when using **FewShotPromptTemplate in LangChain**.

---

## 🚀 Goal

Convert complex medical text into simple human-understandable language using examples.

---

## 📦 Code Flow Overview

```
Examples → Example Template → FewShot Template → format() → Final Prompt → LLM → Output
```

---

## 🔹 Step 1: Define Examples

```js
const examples = [
  {
    input: "The patient is experiencing myocardial infarction...",
    output: "The patient is having a heart attack...",
  },
  {
    input: "The individual presents with acute bronchitis...",
    output: "The person has airway inflammation...",
  }
];
```

### 🧠 What happens?

These examples **teach the model a pattern**:

```
Complex medical text → Simple explanation
```

---

## 🔹 Step 2: Define Example Format

```js
const examplePrompt = new PromptTemplate({
  inputVariables: ["input", "output"],
  template: "Input: {input}\nOutput: {output}\n",
});
```

### 🧠 What happens?

Each example is formatted like:

```
Input: The patient is experiencing myocardial infarction...
Output: The patient is having a heart attack...
```

---

## 🔹 Step 3: Create FewShotPromptTemplate

```js
const prompt = new FewShotPromptTemplate({
  examples,
  examplePrompt,
  suffix: "Input: {myinput}\nOutput:",
  inputVariables: ["myinput"],
});
```

### 🧠 What happens?

LangChain prepares a structure:

```
[Example 1]
[Example 2]

Input: {myinput}
Output:
```

👉 The last part is **left incomplete intentionally**
👉 Model will generate the answer

---

## 🔹 Step 4: Fill Dynamic Input

```js
const res = await prompt.format({
  myinput: "The patient has pneumonia"
});
```

### 🧠 What happens?

Now the final prompt becomes:

```
Input: The patient is experiencing myocardial infarction...
Output: The patient is having a heart attack...

Input: The individual presents with acute bronchitis...
Output: The person has airway inflammation...

Input: The patient has pneumonia
Output:
```

---

## 🔹 Step 5: Send to LLM

```js
const response = await llm.invoke(res);
```

### 🧠 What happens?

Model sees pattern:

```
Input → Output
Input → Output
Input → Output ?
```

👉 It completes the last output

---

## 🔹 Step 6: Final Output

```js
console.log(response.content);
```

### 🧾 Example Output

```
The patient has pneumonia means there is an infection in the lungs which can cause cough, fever, and difficulty breathing.
```

---

## ⚡ Key Concepts

| Concept        | Meaning                          |
| -------------- | -------------------------------- |
| examples       | Sample data to teach pattern     |
| examplePrompt  | Format of each example           |
| suffix         | Where user input goes            |
| inputVariables | Variables to replace dynamically |
| format()       | Builds final prompt              |
| invoke()       | Sends to LLM                     |

---

## 🔥 Why Few-Shot Works

Instead of saying:

```
Explain this simply
```

You SHOW:

```
THIS is how to explain simply
```

👉 Model copies pattern

---

## ❌ Static vs ✅ Dynamic

### ❌ Static (bad)

```
suffix: "Fixed input"
```

### ✅ Dynamic (good)

```
suffix: "{myinput}"
```

👉 Dynamic allows reuse for multiple inputs

---

## 🧠 Final Mental Model

```
FewShotPromptTemplate = PromptTemplate + Examples + Pattern Learning
```

---

## ⚡ One-line Summary

Few-shot prompting teaches the model using examples so it follows the same pattern for new inputs.

---

## 🚀 Use Cases

* Medical → Simple explanations
* Code → Comments
* AI Chatbots → Structured responses
* Jefplexity → Consistent output format

---

## 🎯 Conclusion

FewShotPromptTemplate helps you:

* Control output format
* Improve consistency
* Teach the model without fine-tuning

---

Happy coding 🚀
