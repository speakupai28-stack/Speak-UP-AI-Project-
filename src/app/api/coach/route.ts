import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { speechText, context, goal } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are a professional public speaking and communication coach. You help students become clear, confident, and compelling speakers. Your feedback is warm but specific. Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this student's speech and give coaching feedback.

SPEAKING CONTEXT: ${context || "General speech"}
GOAL: ${goal || "Improve overall delivery"}
SPEECH: "${speechText}"

Return JSON with exactly these fields:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences: what this speech does well and the biggest opportunity>",
  "delivery": {
    "score": <1-10>,
    "feedback": "<feedback on pacing, clarity, tone, energy>",
    "tip": "<one specific fix>"
  },
  "structure": {
    "score": <1-10>,
    "feedback": "<how well organized is it — does it flow logically?>",
    "tip": "<one structural improvement>"
  },
  "persuasion": {
    "score": <1-10>,
    "feedback": "<how compelling and convincing is it?>",
    "tip": "<one way to make it more persuasive>"
  },
  "openingHook": "<rewrite their opening sentence to be more grabbing>",
  "closingLine": "<rewrite their closing line to be more memorable>",
  "powerPhrase": "<one powerful sentence they could add to strengthen their message>",
  "practiceExercise": "<one specific exercise to do before their next speech>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No feedback generated" }, { status: 500 });
  }

  return NextResponse.json(JSON.parse(textBlock.text));
}
