import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { SpeakingProgressionDecision } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { currentLevel, sessions, weaknesses } = await req.json();

  const weaknessSummary = Object.entries(weaknesses as Record<string, number>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count]) => `${label} (${count} sessions)`)
    .join(", ");

  const sessionSummary = (sessions as { type: string; score: number; weaknesses: string[] }[])
    .slice(-5)
    .map((s, i) => `Session ${i + 1}: ${s.type}, score ${s.score}/10, weaknesses: ${s.weaknesses.join(", ")}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    system: `You are a public speaking progression evaluator. Decide whether a student should advance, stay, or drop based on their session history. Dropping to Level 1 is rare — only for students showing fundamental misunderstanding of public speaking. Always respond with valid JSON only.`,
    messages: [
      {
        role: "user",
        content: `Evaluate this student's public speaking progression.

CURRENT LEVEL: ${currentLevel}
RECENT SESSIONS:
${sessionSummary}

TOP WEAKNESSES: ${weaknessSummary || "None recorded yet"}

Return JSON:
{
  "verdict": "advance" | "stay" | "drop",
  "reasoning": "<2-3 sentences explaining the decision clearly to the student>",
  "strengths": ["<2-3 things they demonstrated well>"],
  "gaps": ["<1-2 specific gaps that need work>"],
  "nextFocus": "<the single most important thing to focus on next>"
}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No decision generated" }, { status: 500 });
  }

  const decision: SpeakingProgressionDecision = JSON.parse(textBlock.text);
  return NextResponse.json(decision);
}
