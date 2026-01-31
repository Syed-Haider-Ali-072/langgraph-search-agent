# 🤖 Jarvis AI Chatbot

A **full-stack Generative AI chatbot** built with **Groq LLaMA-3.3**, featuring **tool calling**, **real-time web search**, and **persistent conversation memory**.  
Jarvis can intelligently decide when to search the web and maintain context across multiple user messages.

---

## ✨ Features

- 🧠 **LLM-powered intelligence** using Groq (LLaMA-3.3 70B)
- 🔍 **Real-time web search** via Tavily API
- 🛠 **Automatic tool calling** (LLM decides when to search)
- 💾 **Conversation memory** using thread-based caching
- 🌐 **Full-stack architecture** (Frontend + Backend)
- ⚡ Fast and lightweight Express.js server
- 🎨 Clean UI built with Tailwind CSS
- 🔐 Secure API key handling using environment variables

---


## 🏗 Project Architecture

.
├── frontend/
│ ├── index.html
│ └── script.js
├── assets/
│ └── screenshots
├── chatbot.js # AI logic, memory, and tool calling
├── server.js # Express API server
├── app.js # CLI-based assistant (optional)
├── package.json
├── .env # API keys 
└── .gitignore



## 🧠 How It Works

1. User sends a message from the frontend UI
2. Backend receives the message along with a unique `threadId`
3. Groq LLaMA-3.3 processes the conversation
4. If required, the model **automatically calls the web search tool**
5. Tavily returns real-time data
6. The assistant responds with an informed answer
7. Conversation context is stored and reused for future messages

---

## 📸 Screenshots


### 🧠 Project Code Overview
![Code Overview](assets/Screenshot%202026-01-31%20163928.png)

---

### 🏷️ ChatDPT – Application Title
![ChatDPT Title](assets/Screenshot%202026-01-31%20171333.png)

---

### 💬 Chat User Interface
![Chat UI](assets/Screenshot%202026-01-31%20171418.png)

---

### ⏳ AI Thinking State
![Thinking State](assets/Screenshot%202026-01-31%20171455.png)

---

### 🌐 Web Search Tool Call (Full UI)
![Web Search Tool Call](assets/Screenshot%202026-01-31%20173004.png)

---

### 🚀 Backend Server Running (Node.js)
![Server Running](assets/Screenshot%202026-01-31%20173044.png)



## 🚀 Getting Started

 open terminal:
 paste node --env-file=.env server.js

1️⃣ Clone the repository
git clone https://github.com/Syed-Haider-Ali-072/genai-web-search-groq-powered-ai-chatbot.git