const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

app.get("/", (req, res) => {
  res.send("NEXORA AI Backend is running!");
});

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    const response = await client.chat.completions.create({
      model: "zai-org/GLM-5.3-Flash:zai-org",
      messages: [
        {
          role: "system",
          content: "You are NEXORA AI, a helpful and friendly AI assistant."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });
  } catch (error) {
    console.error("AI error:", error.message);

    res.status(500).json({
      error: "NEXORA AI could not generate a response. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`NEXORA AI running on port ${PORT}`);
});
