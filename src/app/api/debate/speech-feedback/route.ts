import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { SpeechFeedback } from "@/lib/types";

const LEVEL_LENS: Record<number, string> = {
  1: "Evaluate as a beginner coach. Be encouraging. Focus on whether basic structure and argument exist. Don't expect advanced technique.",
  2: "Evaluate as an intermediate coach. Expect logical arguments with evidence. Push for strategic thinking and clash.",
  3: "Evaluate at competition standard. Expect polished delivery, strong evidence, clear impact weighing, and direct clash. Only award 8+ for genuinely tournament-ready work.",
};

export async function POST(req: NextRequest) {
  const { speechText, topic, speechType, level } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are a debate speech coach. ${LEVEL_LENS[level] ?? LEVEL_LENS[1]} Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this Level ${level} debater's speech across 6 dimensions.

TOPIC: "${topic}"
SPEECH TYPE: ${speechType}
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences: what this speech does well and the biggest gap>",
  "structure": {
    "score": <1-10>,
    "feedback": "<is it organized? Does it have a clear intro/body/conclusion?>",
    "tip": "<one specific structural fix>"
  },
  "argument": {
    "score": <1-10>,
    "feedback": "<is the logic sound? Are claims supported?>",
    "tip": "<one way to strengthen the argument>"
  },
  "evidence": {
    "score": <1-10>,
    "feedback": "<are examples specific and relevant?>",
    "tip": "<one evidence improvement>"
  },
  "rebuttal": {
    "score": <1-10>,
    "feedback": "<did they clash with the other side?>",
    "tip": "<one rebuttal improvement>"
  },
  "impact": {
    "score": <1-10>,
    "feedback": "<did they explain why it matters?>",
    "tip": "<one impact improvement>"
  },
  "delivery": {
    "score": <1-10>,
    "feedback": "<pace, confidence, clarity based on the writing style>",
    "tip": "<one delivery tip>"
  },
  "weakness": "<the single biggest weakness — used for tracking>",
  "improvedParagraph": "<take their weakest paragraph and rewrite it at Level ${level} standard>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No feedback generated" }, { status: 500 });
  }

  const feedback: SpeechFeedback = JSON.parse(textBlock.text);
  return NextResponse.json(feedback);
}
