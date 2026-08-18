# AI Chat Bot 🤖

A full-stack AI chatbot application powered by **openai/gpt-oss-120b**, featuring real-time web search via **Tavily**, a built-in calculator tool, and persistent chat history using in-memory caching.

## ✨ Features

- 💬 Conversational AI powered by Groq (LLM inference)
- 🔍 Real-time web search integration via Tavily API for up-to-date answers
- 🧮 Built-in calculator tool for mathematical expressions
- 🗂️ Per-session chat history, tracked via unique session IDs
- ⏱️ Automatic chat history expiry after 24 hours (via Node-Cache)
- ⚡ Simple and lightweight architecture — Node.js backend + React frontend

## 🛠️ Tech Stack

**Frontend:**

- React
- Tailwind CSS

**Backend:**

- Node.js
- Groq SDK (LLM + tool calling)
- Tavily API (web search)
- Node-Cache (in-memory session storage)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bswnthmdk/ai-chat-bot.git
cd ai-chat-bot
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The React app will run on `http://localhost:5173/`

## 📡 API Overview

| Endpoint    | Method | Description                               |
| ----------- | ------ | ----------------------------------------- |
| `/api/chat` | POST   | Send a message and receive a bot response |

**Sample Request Body:**

```json
{
  "message": "What's the weather in Delhi right now?",
  "sessionId": "unique-session-id"
}
```

**Sample Response:**

```json
{
  "response": "It's currently 32°C and sunny in Delhi."
}
```

## 🧠 How It Works

1. Each conversation is tied to a unique `sessionId`.
2. On every user message, the backend checks the cache (Node-Cache) for existing chat history tied to that `sessionId`.
3. If tool usage (search or calculation) is required, the LLM automatically triggers the relevant tool via function/tool calling.
4. The updated conversation (including tool results) is cached again for 24 hours.
5. After 24 hours of inactivity, the session's chat history automatically expires and is deleted.

## 🔑 Environment Variables

| Variable         | Description                    |
| ---------------- | ------------------------------ |
| `GROQ_API_KEY`   | API key for accessing Groq LLM |
| `TAVILY_API_KEY` | API key for Tavily web search  |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/bswnthmdk/ai-chat-bot/issues).
