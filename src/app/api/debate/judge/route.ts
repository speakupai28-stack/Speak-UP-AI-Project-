import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { JudgeBallot } from "@/lib/types";

const LEVEL_STANDARD: Record<number, string> = {
  1: "Judge at a beginner level. Reward clear arguments, basic structure, and effort. Don't penalize for missing advanced technique.",
  2: "Judge at an intermediate level. Reward strategic argumentation, clash, and impact weighing. Penalize dropped arguments.",
  3: "Judge at a competition level. Apply tournament standards. Only award the win to the side with clear impact dominance and technical execution.",
};

export async function POST(req: NextRequest) {
  const { motion, propositionSpeeches, oppositionSpeeches, level } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 768,
    system: `You are a debate judge rendering a ballot. ${LEVEL_STANDARD[level] ?? LEVEL_STANDARD[1]} Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Render a judge ballot for this debate round.

MOTION: "${motion}"
JUDGING STANDARD: Level ${level}

PROPOSITION ARGUMENTS:
${propositionSpeeches}

OPPOSITION ARGUMENTS:
${oppositionSpeeches}

Return JSON:
{
  "winner": "Proposition" | "Opposition",
  "score": <overall debate quality 0-100>,
  "reasoning": "<2-3 sentences explaining why this side won — be specific about the voting issue>",
  "mvp": "<which side's strongest moment was, and what it was>",
  "clashAnalysis": "<where did the real debate happen and who won that clash?>",
  "impactWeighing": "<whose impacts were bigger/more probable and why?>",
  "mainImprovement": "<the single most important thing the losing side needed to do differently>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No ballot generated" }, { status: 500 });
  }

  const ballot: JudgeBallot = JSON.parse(textBlock.text);
  return NextResponse.json(ballot);
}
