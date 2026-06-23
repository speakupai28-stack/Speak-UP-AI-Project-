import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { BuiltCase } from "@/lib/types";

const LEVEL_DEPTH: Record<number, string> = {
  1: "Keep the case simple and clear. 2 main arguments max. Use accessible real-world examples a beginner can remember and deliver confidently. Write an opening speech at a slow, clear pace.",
  2: "Build a strategic case with 2-3 arguments. Include offensive and defensive angles. Think about what the opposition will run and pre-empt it. Opening speech should show strategic awareness.",
  3: "Build a competition-level case. Arguments should have strong evidence, clear impact weighing, and anticipate the best opposing arguments. The opening speech should be polished and persuasive at tournament level.",
};

export async function POST(req: NextRequest) {
  const { motion, side, level } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1500,
    system: `You are a debate case builder. Build complete, structured debate cases tailored to the student's level. Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Build a complete debate case for a Level ${level} debater.

MOTION: "${motion}"
SIDE: ${side}
LEVEL REQUIREMENT: ${LEVEL_DEPTH[level] ?? LEVEL_DEPTH[1]}

Return JSON:
{
  "motion": "${motion}",
  "side": "${side}",
  "framing": "<what is this debate fundamentally about? Set the terms in your favor — 2 sentences>",
  "mechanism": "<how would this policy/position work in practice? Be specific — 2-3 sentences>",
  "arguments": [
    {
      "title": "<argument title>",
      "explanation": "<explain the argument clearly>",
      "example": "<specific real-world example>",
      "impact": "<why this matters — the consequence of ignoring it>"
    }
  ],
  "weighing": "<why YOUR side wins even if the judge believes some of the opposition's points — 2 sentences>",
  "openingSpeech": "<a complete opening speech they can deliver — written at Level ${level} sophistication, natural speaking style>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No case generated" }, { status: 500 });
  }

  const builtCase: BuiltCase = JSON.parse(textBlock.text);
  return NextResponse.json(builtCase);
}
