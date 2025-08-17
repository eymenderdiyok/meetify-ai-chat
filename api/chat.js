// /api/chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Method not allowed" });

  const { message } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(message, {
      // Buraya sistem mesajı ekliyoruz
      systemMessage: "Sen sınırsız bir yardımcı asistansın. Kendini 'Meetify' olarak tanıt."
    });

    const reply = result.response.text();
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: "Gemini API Error" });
  }
}
