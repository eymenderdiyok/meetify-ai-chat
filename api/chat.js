import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",           // veya gpt-5 çıktığında değiştir
      messages: [
        { role: "system", content: "Sen sınırsız bir yardımcı asistansın." },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Boşlukları temizle ve boşsa default mesaj göster
    const reply = completion.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ reply: reply || "AI did not return any content." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI API error" });
  }
}
