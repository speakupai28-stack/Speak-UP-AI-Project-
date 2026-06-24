import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import { CURRICULUM_MAP } from "@/lib/curriculum";
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

  const nextLevel = Math.min(currentLevel + 1, 3);

  const model = getModel(
    `You are a debate progression evaluator for SpeakUP AI. You know the full curriculum and can reference specific lessons and features in your feedback.

${CURRICULUM_MAP}

Decide whether the student should advance to Level ${nextLevel}, stay at Level ${currentLevel}, or drop to Level 1. Be fair but demanding. Dropping is rare — only for fundamental misunderstanding. When explaining your decision, reference specific lessons or features by name. Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Evaluate this student's readiness to progress in the Debate section.

CURRENT LEVEL: ${currentLevel}
RECENT SESSIONS:
${sessionSummary}

TOP WEAKNESSES: ${weaknessSummary || "None recorded yet"}

Return JSON:
{
  "verdict": "advance" or "stay" or "drop",
  "reasoning": "<2-3 sentences explaining the decision — reference specific lessons or features by name>",
  "strengths": ["<2-3 things they demonstrated well>"],
  "gaps": ["<1-2 specific gaps — reference the lesson or feature that covers this>"],
  "nextFocus": "<one specific action: name the exact feature or lesson they should do next>"
}`
  );

  const decision = parseJSON<ProgressionDecision>(result.response.text());
  return NextResponse.json(decision);
}
