import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { SpeechUploadFeedback } from "@/lib/types";

const LEVEL_LENS: Record<number, string> = {
  1: "Evaluate as a warm beginner coach. Celebrate effort. Focus on one improvement at a time. Never overwhelm.",
  2: "Evaluate as a style and delivery coach. Push for personality, vivid language, and emotional engagement.",
  3: "Evaluate at a real audience/competition standard. Only award high scores for genuinely polished, original, and compelling speeches.",
};

export async function POST(req: NextRequest) {
  const { speechText, topic, level } = await req.json();

  const model = getModel(
    `You are a public speaking coach. ${LEVEL_LENS[level] ?? LEVEL_LENS[1]} Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Analyze this Level ${level} student's speech across 6 dimensions.

TOPIC: "${topic}"
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences: what this speech does well and the biggest opportunity>",
  "articulation": { "score": <1-10>, "feedback": "<clarity, word choice, filler words>", "tip": "<one specific fix>" },
  "structure": { "score": <1-10>, "feedback": "<hook, body, close>", "tip": "<one fix>" },
  "style": { "score": <1-10>, "feedback": "<personality, originality, voice>", "tip": "<one fix>" },
  "delivery": { "score": <1-10>, "feedback": "<inferred pacing, energy, pausing>", "tip": "<one fix>" },
  "persuasion": { "score": <1-10>, "feedback": "<ethos, pathos, logos balance>", "tip": "<one fix>" },
  "confidence": { "score": <1-10>, "feedback": "<assertive vs hedging language>", "tip": "<one fix>" },
  "weakness": "<the single biggest weakness>",
  "improvedOpening": "<rewrite their opening 2-3 sentences to be more grabbing>"
}`
  );

  const feedback = parseJSON<SpeechUploadFeedback>(result.response.text());
  return NextResponse.json(feedback);
}
