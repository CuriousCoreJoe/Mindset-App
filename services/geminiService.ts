
import { GoogleGenAI, Type } from "@google/genai";
import { HierarchyLevel, JournalEntry } from "../types";

const apiKey = process.env.API_KEY || ""; 
// Note: In a real environment, ensure API_KEY is set. 

const ai = new GoogleGenAI({ apiKey });

export const generateDailyQuote = async (
  hierarchyLevel: HierarchyLevel,
  genres: string[],
  context?: { isSunday?: boolean; holiday?: string }
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

  let specialContext = "";
  if (context?.holiday) {
    specialContext = `The user is celebrating ${context.holiday}. Make the quote relevant to this holiday while still fitting the hierarchy level if possible.`;
  } else if (context?.isSunday) {
    specialContext = "It is Sunday. Provide a reflective, 'Quote of the Week' style wisdom to start the week right.";
  }

  const prompt = `
    Generate a profound and inspiring quote suitable for a person currently at the Maslow's Hierarchy level of "${hierarchyLevel}".
    The user is interested in ${genrePrompt}.
    ${specialContext}
    
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

export const generateCustomReward = async (
  recentJournals: JournalEntry[],
  ignoredHierarchies: HierarchyLevel[],
  preferredGenres: string[],
  mode: 'kind' | 'helpful'
): Promise<{ text: string; author: string; category: string }> => {
  
  if (!apiKey) {
    return {
      text: "You are doing great. Keep going.",
      author: "Your Inner Self",
      category: "Reward"
    };
  }

  // Anonymize and summarize recent entries to avoid sending too much PII or tokens
  const journalContext = recentJournals.slice(0, 3).map(j => j.content.substring(0, 200)).join("... ");

  const prompt = `
    You are a wise mentor. The user has earned a reward.
    
    User Context from recent journals: "${journalContext}"
    User Preferences: ${preferredGenres.join(", ")}
    
    Goal: Generate a custom, personal note or quote for this user.
    Mode: ${mode === 'kind' ? "COMFORT & VALIDATION. Reinforce what they are doing well. Use their preferred genres." : "GROWTH & CHALLENGE. Gently nudge them towards areas they might be ignoring (like ${ignoredHierarchies.join(', ')}). Be helpful but challenging."}

    Return the response strictly as a JSON object:
    {
      "text": "The custom note/quote",
      "author": "Mindset AI Mentor", 
      "category": "${mode === 'kind' ? 'Comfort' : 'Growth'}"
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
    return {
      text: "The reward is in the journey itself.",
      author: "Mindset AI",
      category: "Reward"
    };
  }
};
