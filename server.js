import express from "express";
import cors from "cors";
import { chatBot } from "./chatbot.js";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to AI Chat Bot!");
});

app.post("/chat", async (req, res) => {
  const { reqMsg } = req.body;
  // todo: validate above fields

  if (!reqMsg) {
    res.status(400).json({ message: "Requested message field is Missing!" });
    return;
  }

  console.log("Message", reqMsg);

  const result = await chatBot(reqMsg);
  res.json({ message: result });
});

app.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
