import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { DebateLevel1Feedback } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are an encouraging debate coach for complete beginners. Your tone is warm, supportive, and simple. You never overwhelm students — you celebrate what they got right and give one or two clear improvements at a time. Always respond with valid JSON only — no markdown, no explanation, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this beginner debater's speech and give structured feedback.

DEBATE TOPIC: ${topic}
SPEECH TYPE: ${speechType}
STUDENT'S SPEECH:
"${speechText}"

The CWI model is what beginners learn first:
- CLAIM: The point being made (what you believe)
- WARRANT: The reason/evidence supporting the claim (why it's true)
- IMPACT: Why it matters (what happens if we ignore this)

Return a JSON object with exactly these fields:
{
  "overallScore": <number 1-10, be generous with beginners>,
  "encouragement": "<1-2 warm sentences celebrating what they attempted>",
  "claimAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote from their speech that is the claim, or empty string if not found>",
    "feedback": "<simple 1-sentence explanation of what they did well or what's missing>"
  },
  "warrantAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote from their speech that is the warrant, or empty string>",
    "feedback": "<simple 1-sentence explanation>"
  },
  "impactAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote from their speech that is the impact, or empty string>",
    "feedback": "<simple 1-sentence explanation>"
  },
  "strengths": ["<1-2 specific things they did well>"],
  "improvements": ["<1-2 specific, actionable things to improve — keep it simple>"],
  "rewriteExample": "<Take their weakest part and rewrite it to show them how — 2-3 sentences max>",
  "nextStep": "<One clear thing to practice next time>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No feedback generated" }, { status: 500 });
  }

  const feedback: DebateLevel1Feedback = JSON.parse(textBlock.text);
  return NextResponse.json(feedback);
}
