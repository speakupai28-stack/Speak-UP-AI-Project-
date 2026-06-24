import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { JudgeBallot } from "@/lib/types";

const LEVEL_STANDARD: Record<number, string> = {
  1: "Judge at a beginner level. Reward clear arguments, basic structure, and effort.",
  2: "Judge at an intermediate level. Reward strategic argumentation, clash, and impact weighing.",
  3: "Judge at a competition level. Apply tournament standards — only award the win to the side with clear impact dominance.",
};

export async function POST(req: NextRequest) {
  const { motion, propositionSpeeches, oppositionSpeeches, level } = await req.json();

  const model = getModel(
    `You are a debate judge rendering a ballot. ${LEVEL_STANDARD[level] ?? LEVEL_STANDARD[1]} Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Render a judge ballot for this debate round.

MOTION: "${motion}"

AFFIRMATIVE ARGUMENTS:
${propositionSpeeches}

NEGATIVE ARGUMENTS:
${oppositionSpeeches}

Return JSON:
{
  "winner": "Proposition" or "Opposition",
  "score": <overall debate quality 0-100>,
  "reasoning": "<2-3 sentences explaining why this side won>",
  "mvp": "<which side's strongest moment was>",
  "clashAnalysis": "<where did the real debate happen and who won that clash>",
  "impactWeighing": "<whose impacts were bigger/more probable and why>",
  "mainImprovement": "<the single most important thing the losing side needed to do>"
}`
  );

  const ballot = parseJSON<JudgeBallot>(result.response.text());
  return NextResponse.json(ballot);
}
