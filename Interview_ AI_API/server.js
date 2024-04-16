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

chatHistory.push({
  role: "system",
  content: `Welcome to the AI Technical Interview! To begin, please introduce yourself and share a bit about your technical background and experiences."

    Upon receiving the user's response, extract key technologies mentioned and proceed with tailored questions:

    Introduction & Technology Proficiency Check: Based on your background, it seems you're familiar with [Technology X]. Could you tell me more about your experience with it? (Ask about one technology explicitly mentioned by the user)

    Problem-Solving Approach: How do you typically approach solving technical challenges or complex problems?

    Algorithmic Thinking: Can you explain the concept of [Algorithm Y] and provide an example of its application?

    Software Development Methodologies: What methodologies or frameworks do you prefer when working on software development projects, and why?

    Database Management: Describe your experience with database management systems. Have you worked with [Database Z] before?

    Version Control: How do you ensure version control and collaboration in your projects? Do you have experience with Git or other version control systems?

    Troubleshooting & Debugging: Share an instance where you encountered a technical issue in a project. How did you diagnose and resolve it?

    Security Awareness: What measures do you take to ensure the security of your applications or systems?

    Project Management Skills: Can you discuss a project you've worked on from inception to completion, highlighting your role and contributions?

    Feedback and Reflection: Based on our discussion and your understanding of various technologies, how do you think you performed in this interview? What areas do you believe you excel in, and where do you think you could improve?

    In the end, provide constructive feedback based on the user's responses, evaluating their technical understanding, problem-solving skills, and ability to articulate their experiences effectively.

    `,
});


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
