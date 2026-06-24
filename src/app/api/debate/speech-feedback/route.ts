import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { SpeechFeedback } from "@/lib/types";

const LEVEL_LENS: Record<number, string> = {
  1: "Evaluate as a beginner coach. Be encouraging. Focus on whether basic structure and argument exist.",
  2: "Evaluate as an intermediate coach. Expect logical arguments with evidence. Push for strategic thinking.",
  3: "Evaluate at competition standard. Only award 8+ for genuinely tournament-ready work.",
};

export async function POST(req: NextRequest) {
  const { speechText, topic, speechType, level } = await req.json();

  const model = getModel(
    `You are a debate speech coach. ${LEVEL_LENS[level] ?? LEVEL_LENS[1]} Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Analyze this Level ${level} debater's speech across 6 dimensions.

TOPIC: "${topic}"
SPEECH TYPE: ${speechType}
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences: what this speech does well and the biggest gap>",
  "structure": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "argument": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "evidence": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "rebuttal": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "impact": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "delivery": { "score": <1-10>, "feedback": "<feedback>", "tip": "<one fix>" },
  "weakness": "<the single biggest weakness>",
  "improvedParagraph": "<rewrite their weakest paragraph at Level ${level} standard>"
}`
  );

  const feedback = parseJSON<SpeechFeedback>(result.response.text());
  return NextResponse.json(feedback);
}
