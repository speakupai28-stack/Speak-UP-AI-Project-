import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { ProgressionDecision } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { currentLevel, sessions, weaknesses } = await req.json();

  const weaknessSummary = Object.entries(weaknesses as Record<string, number>)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([label, count]) => `${label} (appeared ${count} times)`)
    .join(", ");

  const sessionSummary = (sessions as { type: string; score: number; weaknesses: string[] }[])
    .slice(-5)
    .map((s, i) => `Session ${i + 1}: ${s.type}, score ${s.score}/10, weaknesses: ${s.weaknesses.join(", ")}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    system: `You are a debate progression evaluator. Based on a student's session history, decide whether they should advance to the next level, stay, or drop back to Level 1. Be fair but demanding — advancement should reflect genuine understanding. Dropping to Level 1 is rare and only for students showing fundamental misunderstanding. Always respond with valid JSON only.`,
    messages: [
      {
        role: "user",
        content: `Evaluate this student's readiness to progress.

CURRENT LEVEL: ${currentLevel}
RECENT SESSIONS:
${sessionSummary}

TOP WEAKNESSES: ${weaknessSummary || "None recorded yet"}

Based on their scores, weaknesses, and session types — should they advance to Level ${Math.min(currentLevel + 1, 3)}, stay at Level ${currentLevel}, or drop to Level 1?

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

  const decision: ProgressionDecision = JSON.parse(textBlock.text);
  return NextResponse.json(decision);
}
