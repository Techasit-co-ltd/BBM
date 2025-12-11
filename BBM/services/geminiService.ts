import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Contact, Message } from '../types';

let chatSession: Chat | null = null;
let currentContactId: string | null = null;

export const getGeminiResponse = async (
  contact: Contact,
  userMessage: string,
  history: Message[]
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Reset session if switching contacts to ensure clean context
    if (!chatSession || currentContactId !== contact.id) {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: `You are simulating a user on an old-school messaging app called BBM (BlackBerry Messenger). 
          Your name is ${contact.name}. 
          Your persona: ${contact.persona}.
          
          Rules:
          1. Keep responses relatively short and informal, like a real instant message.
          2. Use some early 2010s internet slang if it fits your persona, but don't overdo it.
          3. If the user sends "PING!!!", react with surprise or annoyance.
          4. Do not use hashtags.
          5. Be conversational and engaging.
          `
        }
      });
      
      // Pre-load history (simplified for this demo by just sending the context as the first message if needed, 
      // but for a true chat session we usually just start fresh or map history to Content objects.
      // To keep it simple and stateless for the demo, we just rely on the fresh session).
      currentContactId = contact.id;
    }

    const result: GenerateContentResponse = await chatSession.sendMessage({ message: userMessage });
    return result.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Network error. (X)";
  }
};