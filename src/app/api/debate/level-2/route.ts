import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are a demanding debate coach for intermediate students. You push back on weak arguments, identify strategic gaps, and force students to think deeper. Be direct and specific. Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this intermediate debater's speech with a strategic lens.

TOPIC: ${topic}
SPEECH TYPE: ${speechType}
SPEECH: "${speechText}"

Return JSON with exactly these fields:
{
  "overallScore": <1-10>,
  "verdict": "<1 sentence strategic verdict — direct and honest>",
  "strategicStrengths": ["<what strategic moves worked>"],
  "weaknesses": ["<strategic gaps the opponent would exploit>"],
  "missedOpportunities": ["<turns or offensive moves they could have run>"],
  "timeAllocation": "<feedback on how they spent their argument — what should get more/less weight>",
  "flowAnalysis": "<what would be winning/losing on the flow right now and why>",
  "challengeQuestion": "<one hard cross-ex question an opponent would use to destroy their weakest point>",
  "improvedVersion": "<rewrite their weakest argument as a strategic debater would — 3-4 sentences>",
  "nextDrill": "<one specific drill to fix their biggest weakness>"
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
