import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { BuiltCase } from "@/lib/types";

const LEVEL_DEPTH: Record<number, string> = {
  1: "Keep the case simple and clear. 2 main arguments max. Use accessible real-world examples a beginner can remember and deliver confidently.",
  2: "Build a strategic case with 2-3 arguments. Include offensive and defensive angles. Think about what the opposition will run and pre-empt it.",
  3: "Build a competition-level case. Arguments should have strong evidence, clear impact weighing, and anticipate the best opposing arguments.",
};

export async function POST(req: NextRequest) {
  const { motion, side, level } = await req.json();

  const model = getModel(
    "You are a debate case builder. Build complete, structured debate cases tailored to the student's level. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Build a complete debate case for a Level ${level} debater.

MOTION: "${motion}"
SIDE: ${side}
LEVEL REQUIREMENT: ${LEVEL_DEPTH[level] ?? LEVEL_DEPTH[1]}

Return JSON:
{
  "motion": "${motion}",
  "side": "${side}",
  "framing": "<what is this debate fundamentally about — 2 sentences>",
  "mechanism": "<how would this policy/position work — 2-3 sentences>",
  "arguments": [
    {
      "title": "<argument title>",
      "explanation": "<explain the argument clearly>",
      "example": "<specific real-world example>",
      "impact": "<why this matters>"
    }
  ],
  "weighing": "<why YOUR side wins even if the judge believes some opposition points>",
  "openingSpeech": "<a complete opening speech they can deliver>"
}`
  );

  const builtCase = parseJSON<BuiltCase>(result.response.text());
  return NextResponse.json(builtCase);
}
