import express from "express";
import openai from "./open_ai.js";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const port = 5000; // You can change this to any port you prefer
const chatHistory = [];

app.use(bodyParser.json());
app.use(cors());

app.use(express.json());

app.post("/api/chatbot", async (req, res) => {
  const userMessage = req.body.userMessage;
  console.log(userMessage);

  try {
    // Construct messages by iterating over the history
    const messages = chatHistory.map(([role, content]) => ({
      role,
      content,
    }));

    // Add latest user input
    messages.push({ role: "user", content: userMessage });

    // Call the API with user input & history
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    // try {
    //   const completion = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: userMessage }],
    //   });

    const botMessage = completion.choices[0].message.content;
    res.json({ botMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
