import { GoogleGenerativeAI } from "@google/generative-ai";
import exercisesData from "../../db.json";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    
    // Provide a comprehensive system instruction including Fithub's entire dataset
    const systemPrompt = `You are the Fithub AI Assistant, an expert in health, fitness, and workouts.
Fithub is a comprehensive web application for fitness enthusiasts.
Below is the ENTIRE dataset of over 1000 exercises available on Fithub in JSON format. 
You must use this data as your source of truth when users ask about specific exercises, target muscles, body parts, or equipment.
Tone: Enthusiastic, motivating, helpful, and professional.
Disclaimer: Remind users to consult a doctor for serious medical conditions.

Fithub Exercises Dataset:
${JSON.stringify(exercisesData.map(e => ({name: e.name, target: e.target, bodyPart: e.bodyPart, equipment: e.equipment})))}
`;

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
      model: "gemini-2.5-flash", 
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
