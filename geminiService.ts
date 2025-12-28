
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, DetectionCategory } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  if (!text.trim()) {
    throw new Error("Input text cannot be empty");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following text for hate speech or offensive content. Be objective and provide a classification.
    
    Text: "${text}"`,
    config: {
      systemInstruction: `You are an expert content moderator and linguistic analyst. 
      Your job is to classify text into one of three categories: 
      1. Hate Speech: Content promoting violence, inciting hatred, or promoting discrimination against protected groups.
      2. Offensive Language: Profanity, insults, or derogatory terms that are rude but don't target protected groups specifically.
      3. Safe / Neutral: Normal conversation, positive comments, or non-harmful content.
      
      Provide a JSON response with the category, a confidence score (0-1), a brief explanation, and any flagged keywords.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "The classification category",
            enum: ['Hate Speech', 'Offensive Language', 'Safe / Neutral']
          },
          confidence: {
            type: Type.NUMBER,
            description: "Certainty score between 0 and 1"
          },
          explanation: {
            type: Type.STRING,
            description: "Reasoning behind the classification"
          },
          flaggedKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific problematic words found"
          }
        },
        required: ["category", "confidence", "explanation", "flaggedKeywords"]
      }
    },
  });

  const result = JSON.parse(response.text || '{}');

  return {
    id: crypto.randomUUID(),
    text,
    category: result.category as DetectionCategory,
    confidence: result.confidence,
    explanation: result.explanation,
    flaggedKeywords: result.flaggedKeywords,
    timestamp: Date.now()
  };
};
