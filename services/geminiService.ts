import { GoogleGenAI } from "@google/genai";
import { GeoLocation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODELS = {
  FAST: 'gemini-2.5-flash',
};

export const generateCrisisStrategy = async (userInput: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: userInput,
      config: {
        systemInstruction: "Você é um especialista em geriatria e Alzheimer. O usuário é um familiar estressado em Belo Horizonte. O paciente pode ter operado o fêmur recentemente. Dê um conselho IMEDIATO, CURTO e PRÁTICO sobre o que dizer e fazer para acalmar o paciente. Use técnica de validação. Não dê conselhos médicos complexos, foque no comportamental. Responda em tópicos formatados em Markdown.",
      },
    });
    return response.text || "Não foi possível gerar uma resposta.";
  } catch (error) {
    console.error("Crisis API Error:", error);
    throw new Error("Erro ao conectar com a Assistente.");
  }
};

export const draftFamilyMessage = async (userInput: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: userInput,
      config: {
        systemInstruction: "Você é um mediador familiar experiente. Ajude a redigir uma mensagem de WhatsApp para o grupo da família. O tom deve ser firme mas educado, focado na necessidade de cooperação e divisão de custos/tarefas para o cuidado da idosa. Evite agressividade, mas seja claro sobre os limites.",
      },
    });
    return response.text || "Não foi possível gerar a mensagem.";
  } catch (error) {
    console.error("Message API Error:", error);
    throw new Error("Erro ao gerar mensagem.");
  }
};

export const searchNearbyResources = async (query: string, location?: GeoLocation): Promise<string> => {
  try {
    // Default to BH center if permission denied
    const latLng = location || { latitude: -19.9167, longitude: -43.9345 };

    const response = await ai.models.generateContent({
      model: MODELS.FAST,
      contents: `Encontre lugares em Belo Horizonte relacionados a: ${query}. Liste nome, endereço e telefone se disponível.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: latLng
          }
        }
      }
    });

    // Extract text and grounding metadata if available
    let text = response.text || "";
    
    // Append Google Maps links if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      const links = chunks
        .filter((c: any) => c.maps?.uri)
        .map((c: any) => `\n- [Abrir no Mapa: ${c.maps.title}](${c.maps.uri})`)
        .join("");
      
      if (links) {
        text += "\n\n**Links do Google Maps:**" + links;
      }
    }

    return text || "Nenhum local encontrado.";

  } catch (error) {
    console.error("Maps API Error:", error);
    throw new Error("Erro ao buscar locais.");
  }
};
