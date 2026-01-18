import { GoogleGenAI } from "@google/genai";

export const getAIExplanation = async (code: string, context: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following code and explanation context. 
        Provide a concise "AI Pro Tip" or high-level technical insight related to this specific implementation.
        
        CODE:
        ${code}
        
        CONTEXT:
        ${context}
      `,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI insights. Check API configuration.";
  }
};

export const summarizeArticle = async (content: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this technology article in exactly 2 visionary sentences: ${content}`,
    });

    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("Summarization failed:", error);
    return "Summarization failed.";
  }
};