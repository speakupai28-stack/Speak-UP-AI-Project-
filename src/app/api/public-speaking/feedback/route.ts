import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { SpeechUploadFeedback } from "@/lib/types";

const LEVEL_LENS: Record<number, string> = {
  1: "Evaluate as a warm beginner coach. Celebrate effort. Focus on one improvement at a time. Never overwhelm. Reward clarity and attempt over polish.",
  2: "Evaluate as a style and delivery coach. Push for personality, vivid language, and emotional engagement. Point out where the speech feels flat or generic.",
  3: "Evaluate at a real audience/competition standard. Only award high scores for speeches that are genuinely polished, original, and compelling. Be direct.",
};

export async function POST(req: NextRequest) {
  const { speechText, topic, level } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are a public speaking coach. ${LEVEL_LENS[level] ?? LEVEL_LENS[1]} Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this Level ${level} student's speech across 6 dimensions.

TOPIC: "${topic}"
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences: what this speech does well and the biggest opportunity>",
  "articulation": {
    "score": <1-10>,
    "feedback": "<clarity of language, word choice, filler words, enunciation in writing>",
    "tip": "<one specific articulation fix>"
  },
  "structure": {
    "score": <1-10>,
    "feedback": "<is there a clear hook, body, and closing call to action?>",
    "tip": "<one structural improvement>"
  },
  "style": {
    "score": <1-10>,
    "feedback": "<does it sound like a real person? Is there personality and originality?>",
    "tip": "<one way to add more voice and style>"
  },
  "delivery": {
    "score": <1-10>,
    "feedback": "<infer pacing, energy, and pausing from how the speech is written>",
    "tip": "<one delivery improvement>"
  },
  "persuasion": {
    "score": <1-10>,
    "feedback": "<is there ethos, pathos, logos? Does it move the audience?>",
    "tip": "<one persuasion improvement>"
  },
  "confidence": {
    "score": <1-10>,
    "feedback": "<does the language feel assertive and convicted, or hedging and uncertain?>",
    "tip": "<one confidence fix — e.g. remove 'I think', 'maybe', 'kind of'>"
  },
  "weakness": "<the single biggest weakness across all dimensions — used for tracking>",
  "improvedOpening": "<rewrite just their opening 2-3 sentences to be more grabbing at Level ${level} standard>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No feedback generated" }, { status: 500 });
  }

  const feedback: SpeechUploadFeedback = JSON.parse(textBlock.text);
  return NextResponse.json(feedback);
}
