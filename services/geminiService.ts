import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// 1. FAST RESPONSES (Flash Lite) - For Dashboard Summaries
export const getQuickSummary = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
    });
    return response.text || "No summary available.";
  } catch (error) {
    console.error("Flash Lite Error:", error);
    return "Unable to generate summary at this time.";
  }
};

// 2. IMAGE EDITING (Flash Image) - For Dental Imaging
export const editDentalImage = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    // Determine mime type if possible, default to png for generic base64
    const mimeType = base64Image.substring(base64Image.indexOf(':') + 1, base64Image.indexOf(';'));
    const cleanBase64 = base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/png',
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

// 3. SEARCH GROUNDING (Flash + Search) - For Medical Research
export const searchMedicalInfo = async (query: string): Promise<{ text: string; sources: any[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract web sources
    const sources = chunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return { text, sources };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    throw error;
  }
};

// 4. MAPS GROUNDING (Flash + Maps) - For Referrals
export const findLocations = async (query: string, userLocation?: { lat: number; lng: number }): Promise<{ text: string; locations: any[] }> => {
  try {
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: config
    });

    const text = response.text || "No locations found.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract map sources
    const locations = chunks
      .filter((chunk: any) => chunk.groundingMetadata?.groundingChunks || chunk) // Adjust based on actual chunk structure usually it's mixed
      .map((chunk: any) => {
         // Attempt to extract map data if present in specific structure
         // Note: Actual structure depends on query result type (place vs general map)
         return chunk; 
      });

    // For display purposes, we might just parse the text or specific grounding chunks if available in specific format
    // Simplified extraction for demo:
    return { text, locations: [] }; // The text usually contains the markdown links for maps
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    throw error;
  }
};

// 5. INTELLIGENT CHAT (Pro) - For Complex Assistant
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are an expert dental assistant and clinic manager. You help with patient triage, administrative tasks, and complex medical terminology explanations. Be professional, concise, and helpful.",
    },
  });
};
