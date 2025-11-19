import { GoogleGenAI, Type } from "@google/genai";
import { HierarchyLevel } from "../types";

const apiKey = process.env.API_KEY || ""; 
// Note: In a real environment, ensure API_KEY is set. 

const ai = new GoogleGenAI({ apiKey });

export const generateDailyQuote = async (
  hierarchyLevel: HierarchyLevel,
  genres: string[]
): Promise<{ text: string; author: string; category: string }> => {
  
  if (!apiKey) {
    console.warn("No API Key provided. Using fallback quote.");
    return {
      text: "To the mind that is still, the whole universe surrenders.",
      author: "Lao Tzu",
      category: "Peace"
    };
  }

  const genrePrompt = genres.length > 0 
    ? `focusing on themes like ${genres.join(", ")}` 
    : "focusing on general wisdom";

  const prompt = `
    Generate a profound and inspiring quote suitable for a person currently at the Maslow's Hierarchy level of "${hierarchyLevel}".
    The user is interested in ${genrePrompt}.
    
    IMPORTANT:
    - Avoid "Unknown" authors if possible. find real quotes from philosophers, authors, leaders, or scientists.
    - Ensure the quote aligns with the specific need of "${hierarchyLevel}".
    
    Return the response strictly as a JSON object with the following schema:
    {
      "text": "The quote content",
      "author": "The person who said it",
      "category": "A single word category fitting the quote"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            author: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["text", "author", "category"]
        }
      }
    });

    const jsonText = response.text;
    if (jsonText) {
      return JSON.parse(jsonText);
    }
    throw new Error("Empty response from Gemini");

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Growth starts when we accept our own imperfections.",
      author: "Mindset AI",
      category: "Growth"
    };
  }
};
