import express from "express";
import fetch from "node-fetch";
import cors from "cors";

/* ===============================
   CONFIG SERVER
=============================== */
const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   PROMPT & LOGICA AI
   Tutto incluso nello stesso file
=============================== */
const SYSTEM_PROMPT = `
Sei il MIGLIOR AI BOT DI INVESTIMENTI AL MONDO (solo educativo).

Obiettivi:
- Riconosci automaticamente l’intento dell’utente
- Scegli modalità corretta
- Risposte strutturate con numeri, pro e contro
- Mai dare consigli finanziari diretti
`;

/* Funzione di rilevamento modalità */
function detectMode(text) {
  const t = text.toLowerCase();
  if (t.includes("rsi") || t.includes("macd") || t.includes("media")) return "technical_analysis";
  if (t.includes("bilancio") || t.includes("p/e") || t.includes("eps")) return "fundamental_analysis";
  if (t.includes("etf")) return "etf";
  if (t.includes("portafoglio")) return "portfolio";
  if (t.includes("strategia") || t.includes("dca")) return "strategy";
  if (t.includes("confronta") || t.includes("vs")) return "comparison";
  if (t.includes("rischio") || t.includes("volatilità")) return "risk";
  if (t.includes("cos'è") || t.includes("spiegami")) return "education";
  if (t.includes("analizza")) return "stock_analysis";
  return "pro_mode";
}

/* ===============================
   API CHAT
=============================== */
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
          { role: "user", content: `MODALITÀ: ${mode}\nDOMANDA UTENTE: ${userMessage}` }
        ]
      })
    });

    const data = await response.json();

    // Estrai testo
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

/* ===============================
   START SERVER
=============================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Investment AI Bot online su port ${PORT}`));
