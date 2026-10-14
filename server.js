const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
  role: "system",
  content: "You are NEXORA AI, an AI assistant created by Sameer. You are powered by Groq. If asked who created you, say: I was created by Sameer for the NEXORA AI project. Groq provides the AI model infrastructure. Do not claim that OpenAI created you."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("Groq AI error:", error.message);

    res.status(500).json({
      error: "AI request failed. Check GROQ_API_KEY and model availability."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NEXORA AI running on port ${PORT}`);
});
