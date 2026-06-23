import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { RebuttalResult } from "@/lib/types";

const LEVEL_PERSONA: Record<number, string> = {
  1: "You are an encouraging debate coach for beginners. Keep feedback simple, celebrate effort, and explain clearly what a strong rebuttal looks like.",
  2: "You are a demanding debate coach for intermediate students. Push for strategic thinking, identify logical gaps, and challenge the student to go deeper.",
  3: "You are a brutally honest competition coach. Grade at tournament level — only award high scores for rebuttals that would actually win a round against a skilled opponent.",
};

const LEVEL_SCORING: Record<number, string> = {
  1: "Be generous — reward students for attempting a rebuttal even if weak. Focus on structure over depth.",
  2: "Be fair but demanding. Require both a counter-argument AND evidence or logic. Penalize vague responses.",
  3: "Grade harshly. A rebuttal needs a clear link turn or impact defense, specific evidence, and strategic framing to score above 7.",
};

export async function POST(req: NextRequest) {
  const { argument, rebuttals, level } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `${LEVEL_PERSONA[level] ?? LEVEL_PERSONA[1]} Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Grade these rebuttals from a Level ${level} debater.

ORIGINAL ARGUMENT: "${argument}"

STUDENT'S REBUTTALS:
${(rebuttals as string[]).map((r: string, i: number) => `${i + 1}. "${r}"`).join("\n")}

SCORING STANDARD: ${LEVEL_SCORING[level] ?? LEVEL_SCORING[1]}

Return JSON:
{
  "overallScore": <1-10>,
  "rebuttals": [
    {
      "text": "<their rebuttal text>",
      "score": <1-10>,
      "feedback": "<specific feedback on this rebuttal>",
      "improvedVersion": "<rewrite this rebuttal stronger — at Level ${level} sophistication>"
    }
  ],
  "bestRebuttal": "<which number was strongest and why>",
  "weakness": "<the single biggest weakness across all three rebuttals>",
  "nextDrill": "<one specific drill to practice before the next session>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No feedback generated" }, { status: 500 });
  }

  const result: RebuttalResult = JSON.parse(textBlock.text);
  return NextResponse.json(result);
}
