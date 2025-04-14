const fetch = require("node-fetch");

let requestCounts = {}; // Rate limiting tracker

exports.handler = async function (event) {
  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["client-ip"] ||
    "unknown";
  const now = Date.now();

  // Keep only recent requests (last 60 sec)
  requestCounts[ip] = (requestCounts[ip] || []).filter((ts) => now - ts < 60_000);
  requestCounts[ip].push(now);

  if (requestCounts[ip].length > 6) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: "Too many requests. Please try again later.",
      }),
    };
  }

  // Extract data from request body
  const { ingredients, mealType, alternativeMode, followUp, result } = JSON.parse(
    event.body
  );

  const prompt = getPrompt({ ingredients, mealType, alternativeMode, followUp, result });

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

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: data.generations?.[0]?.text || "No recipes found.",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong: " + err.message,
      }),
    };
  }
};

// Builds the prompt string depending on whether it's a fresh recipe or a follow-up
function getPrompt({ ingredients, mealType, alternativeMode, followUp, result }) {
  if (followUp) {
    return `User asked a follow-up question about this recipe:\n"${result}"\n\nFollow-up: "${followUp}"\n\nAnswer like a helpful cooking assistant.`;
  }

  const mealPrefix =
    mealType !== "any"
      ? `These are my ${mealType} ingredients: `
      : "I have these ingredients: ";

  const basePrompt = alternativeMode
    ? "I already received some recipes for these ingredients. Please now suggest 2–3 completely different and unique dishes. Do not repeat or rephrase anything from earlier. Include full step-by-step instructions for each."
    : "What are 2–3 unique dishes I can make with them? Please include step-by-step instructions for each.";

  return mealPrefix + ingredients + ". " + basePrompt;
}
