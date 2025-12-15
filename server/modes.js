export function detectMode(text) {
  const t = text.toLowerCase();
  if (t.includes("rsi") || t.includes("macd")) return "technical_analysis";
  if (t.includes("bilancio") || t.includes("p/e")) return "fundamental_analysis";
  if (t.includes("etf")) return "etf";
  if (t.includes("portafoglio")) return "portfolio";
  if (t.includes("strategia")) return "strategy";
  if (t.includes("confronta") || t.includes("vs")) return "comparison";
  if (t.includes("rischio") || t.includes("volatilità")) return "risk";
  if (t.includes("cos'è") || t.includes("spiegami")) return "education";
  if (t.includes("analizza")) return "stock_analysis";
  return "pro_mode";
}
