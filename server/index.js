const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔒 Simple in-memory rate limiter (6 requests/minute per IP)
const requestCounts = {};

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();

  requestCounts[ip] = (requestCounts[ip] || []).filter(ts => now - ts < 60000);
  requestCounts[ip].push(now);

  if (requestCounts[ip].length > 6) {
    return res.status(429).json({
      error: "⏱️ Too many requests. Please try again in a minute.",
    });
  }

  next();
}

app.post("/api/recipe", rateLimiter, async (req, res) => {
  const { ingredients, mealType, alternativeMode, followUp, result } = req.body;

  // 🧠 Generate smart prompt
  let prompt;

  if (followUp && result) {
    prompt = `The user previously received this recipe:\n"${result}"\n\nFollow-up question: "${followUp}"\n\nAnswer as a helpful cooking assistant with clear and practical tips.`;
  } else {
    const intro = `I have these ingredients ${mealType !== "any" ? `for ${mealType}` : ""}: ${ingredients}.`;

    const basePrompt = alternativeMode
      ? `Please suggest 2–3 completely different and creative dishes from anything suggested earlier, Do not repeat or rephrase them. Include full step-by-step instructions for each.`
      : `Suggest 2–3 creative and popular recipe ideas I can cook using only these ingredients. Include full step-by-step instructions.`;

    prompt = `${intro}\n\n${basePrompt}`;
  }

  try {
    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "command",
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
        p: 0.8,
      }),
    });

    const data = await response.json();
    res.json({ text: data.generations?.[0]?.text || "No response generated." });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
