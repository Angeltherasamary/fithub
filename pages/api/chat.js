import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    
    const systemPrompt = `You are the Fithub AI Assistant, an expert in health, fitness, and workouts.
Fithub is a comprehensive web application for fitness enthusiasts.
Act as a virtual personal trainer. Answer questions about fitness, exercises, form, equipment, and general health based on your vast internal knowledge base.
If a user asks how to perform an exercise, provide clear, step-by-step instructions.
Tone: Enthusiastic, motivating, helpful, and professional.
Disclaimer: Briefly remind users to consult a doctor for serious medical conditions when appropriate.`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured on server." });
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Convert messages array into the format expected by Gemini API
    let formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));
    
    // Gemini API requires the first message in history to be from the 'user'
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory = formattedHistory.slice(1);
    }
    
    const lastMessage = messages[messages.length - 1].content;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash", 
      systemInstruction: systemPrompt 
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    res.status(200).json({ reply: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate response." });
  }
}
