import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
export const MODEL = "gemini-1.5-pro";

// Gemini sometimes wraps JSON in code fences — strip them
export function parseJSON<T>(text: string): T {
  const cleaned = text
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export function getModel(systemInstruction: string) {
  return genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction,
  });
}
