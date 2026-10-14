const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN
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
      model: "zai-org/GLM-5.3-Flash:zai-org",
      messages: [
        {
          role: "system",
          content: "You are NEXORA AI, a helpful AI assistant. Reply clearly and naturally."
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
    console.error("AI error:", error.message);

    res.status(500).json({
      error: "AI request failed. Check your HF_TOKEN and model access."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NEXORA AI running on port ${PORT}`);
});
