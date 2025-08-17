import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { message } = body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);

    let reply = "";
    if (result.response.text) {
      reply = result.response.text();
    } else if (result.response.candidates?.length) {
      reply = result.response.candidates[0].content.parts[0].text;
    }

    res.status(200).json({ reply: reply || "(empty response)" });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Failed to get response from Gemini" });
  }
}
