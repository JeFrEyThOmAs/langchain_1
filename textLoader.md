# 📄 LangChain JS Document Loaders (Latest Reference)

## 🧠 What are Document Loaders?

Document Loaders in LangChain are used to **load data from different sources** (files, web, APIs) and convert them into a standard `Document` format. ([LangChain Docs][1])

They are the **first step in RAG pipelines**.

---

# 📂 1. File Loaders (Local Files)

## 📄 Text File

```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
```

---

## 📑 PDF File

```js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
```

---

## 📊 CSV File

```js
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
```

---

## 🧾 JSON File

```js
import { JSONLoader } from "@langchain/community/document_loaders/fs/json";
```

---

## 🌐 HTML File

```js
import { BSHTMLLoader } from "@langchain/community/document_loaders/fs/html";
```

---

## 📁 Directory (multiple files)

```js
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
```

---

## 🧩 Unstructured Files (many formats like docx, ppt, etc.)

```js
import { UnstructuredLoader } from "@langchain/community/document_loaders/fs/unstructured";
```

---

# 🌍 2. Web Loaders

## 🌐 Load a Web Page

```js
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
```

---

## 🔗 Recursive Website Loader

```js
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
```

---

## 🗺️ Sitemap Loader

```js
import { SitemapLoader } from "@langchain/community/document_loaders/web/sitemap";
```

---

# ☁️ 3. Cloud & Integrations

## 📦 Google Drive

```js
import { GoogleDriveLoader } from "@langchain/community/document_loaders/fs/google_drive";
```

---

## ☁️ AWS S3

```js
import { S3FileLoader } from "@langchain/community/document_loaders/fs/s3";
```

---

## 🧠 Notion

```js
import { NotionLoader } from "@langchain/community/document_loaders/fs/notion";
```

---

## 💬 Slack

```js
import { SlackDirectoryLoader } from "@langchain/community/document_loaders/fs/slack";
```

---

# 🎧 4. Special Loaders

## 🎙️ Audio Transcript

```js
import { AudioTranscriptLoader } from "@langchain/community/document_loaders/fs/audio";
```

---

## 📺 YouTube Transcript

```js
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
```

---

# ⚠️ Important Notes (VERY IMPORTANT)

* LangChain JS has **multiple package splits**:

  * `@langchain/classic` → core + some loaders
  * `@langchain/community` → most integrations

* Some loaders require **extra dependencies** (e.g., PDF needs `pdf-parse`). ([LangChain Docs][2])

* Import paths **change frequently**, so always check docs if something breaks.

---

# 🧠 Summary

* Document Loaders = **data ingestion layer**
* They support:

  * Files (PDF, TXT, CSV, JSON)
  * Websites
  * Cloud tools (Drive, S3, Notion)
  * Media (audio, YouTube)

👉 Used in RAG to load external data before processing.

---

# 🚀 Tip for Your Project

For your notes explainer app:

* Start with:

  * TextLoader
  * PDFLoader
* Then expand to:

  * WebLoader (for online notes)
  * DirectoryLoader (multiple files)

---

[1]: https://docs.langchain.com/oss/javascript/integrations/document_loaders?utm_source=chatgpt.com "Document loader integrations - Docs by LangChain"
[2]: https://docs.langchain.com/oss/javascript/integrations/document_loaders/file_loaders/pdf?utm_source=chatgpt.com "PDFLoader integration - Docs by LangChain"
