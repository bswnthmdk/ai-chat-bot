import express from "express";
import cors from "cors";
import { chatBot } from "./chatbot.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/api/", (req, res) => {
  res.send("Welcome to AI Chat Bot!");
});

app.post("/api/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message.trim() || !sessionId.trim()) {
    res.status(400).json({
      message: "Requested message or sessionId is Missing!",
    });
    return;
  }

  console.log("Human:", message);

  const result = await chatBot(message, sessionId);

  console.log("Bot:", result);

  res.json({
    response: result,
  });
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}/api/`);
});
