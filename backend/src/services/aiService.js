import config from "../config/index.js";

// Switch to Gemini Generative Language API instead of OpenAI.
// We keep the same exported functions so the rest of the app doesn't change.

const GEMINI_API_KEY = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || "";
// Use a model that your project actually supports (from /v1/models)
const GEMINI_MODEL = "gemini-2.5-flash";

const hasGemini = Boolean(GEMINI_API_KEY && GEMINI_API_KEY !== "your_openai_api_key_here");

async function callGemini(prompt, extraParts = []) {
  if (!hasGemini) {
    throw new Error("Gemini API key not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          ...extraParts.map((t) => ({ text: t })),
        ],
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const candidate = json.candidates?.[0];
  const partText = candidate?.content?.parts?.map((p) => p.text || "").join("") || "";
  return partText.trim();
}

export async function summarize(content) {
  if (!hasGemini) return content.slice(0, 200) + (content.length > 200 ? "..." : "");
  try {
    const prompt = "Summarize the following text in about 2-3 concise sentences (roughly 150-200 words max).";
    const text = await callGemini(prompt, [content.slice(0, 4000)]);
    return text || content.slice(0, 200) + "...";
  } catch (e) {
    console.error("AI summarize error:", e.message);
    return content.slice(0, 200) + "...";
  }
}

export async function generateTags(content) {
  if (!hasGemini) return [];
  try {
    const prompt =
      "You are an expert knowledge organizer. From the following note, extract 4-8 highly specific topic tags. " +
      "Focus on concrete concepts, entities, technologies, frameworks, and domains (for example: 'osint', 'cyber threat intelligence', 'open source investigations', 'malware analysis'). " +
      "Avoid generic words like 'introduction', 'basics', 'overview', 'information', 'data', 'article', 'note'. " +
      "Prefer multi-word tags when helpful, but keep each tag under 4 words. " +
      "Respond ONLY with a JSON array of lowercase strings, e.g. [\"osint\",\"cyber threat intelligence\"].";
    const raw = await callGemini(prompt, [content.slice(0, 4000)]);
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map((t) => String(t)) : [];
    } catch {
      // If the model answered with prose, fall back to splitting by commas
      return raw
        .split(/[\n,]/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 7);
    }
  } catch (e) {
    console.error("AI tag error:", e.message);
    return [];
  }
}

export async function chatWithKnowledge(question, contextDocs) {
  if (!hasGemini) return "AI is not configured. Please add your Gemini API key.";
  const context = contextDocs
    .map((d, i) => `[${i + 1}] ${d.title}\n${(d.content || "").slice(0, 500)}`)
    .join("\n\n");
  try {
    const prompt =
      "You are a helpful writing and knowledge assistant. Use the following knowledge base entries as helpful context, " +
      "but you may also use your own knowledge to continue, summarize, or generate ideas. " +
      "If the context is very short, you should still write a helpful, detailed answer or continuation.\n\nCONTEXT:\n" +
      context +
      "\n\nQUESTION:\n" +
      question;

    const answer = await callGemini(prompt);
    return answer || "Sorry, an error occurred while processing your question.";
  } catch (e) {
    console.error("AI chat error:", e.message);
    return "Sorry, an error occurred while processing your question.";
  }
}
