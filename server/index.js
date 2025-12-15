import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import { SYSTEM_PROMPT } from "./prompt.js";
import { detectMode } from "./modes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const mode = detectMode(userMessage);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `MODALITÀ: ${mode}\nDOMANDA: ${userMessage}` }
        ]
      })
    });

    const data = await response.json();

    let text = "";
    for (const block of data.content || []) {
      if (block.type === "text") text += block.text;
    }

    res.json({ mode, answer: text || "Errore nel bot" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore server" });
  }
});

app.listen(3000, () => console.log("🚀 Investment AI Server online su port 3000"));
