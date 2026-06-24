import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { RebuttalResult } from "@/lib/types";

const LEVEL_PERSONA: Record<number, string> = {
  1: "You are an encouraging debate coach for beginners. Keep feedback simple, celebrate effort, and explain clearly what a strong rebuttal looks like.",
  2: "You are a demanding debate coach for intermediate students. Push for strategic thinking, identify logical gaps, and challenge the student to go deeper.",
  3: "You are a brutally honest competition coach. Grade at tournament level — only award high scores for rebuttals that would actually win a round against a skilled opponent.",
};

export async function POST(req: NextRequest) {
  const { argument, rebuttals, level } = await req.json();

  const model = getModel(
    `${LEVEL_PERSONA[level] ?? LEVEL_PERSONA[1]} Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Grade these rebuttals from a Level ${level} debater.

ORIGINAL ARGUMENT: "${argument}"

STUDENT'S REBUTTALS:
${(rebuttals as string[]).map((r, i) => `${i + 1}. "${r}"`).join("\n")}

Return JSON:
{
  "overallScore": <1-10>,
  "rebuttals": [
    {
      "text": "<their rebuttal text>",
      "score": <1-10>,
      "feedback": "<specific feedback>",
      "improvedVersion": "<rewrite this rebuttal stronger>"
    }
  ],
  "bestRebuttal": "<which number was strongest and why>",
  "weakness": "<the single biggest weakness across all rebuttals>",
  "nextDrill": "<one specific drill to practice>"
}`
  );

  const result2 = parseJSON<RebuttalResult>(result.response.text());
  return NextResponse.json(result2);
}
