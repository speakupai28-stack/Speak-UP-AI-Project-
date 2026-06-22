import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText, judgeParadigm } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are a brutally honest competition debate coach. You coach students preparing for elimination rounds. No sugar-coating — if an argument would lose the round, say so clearly. Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Give elite-level tournament feedback on this speech.

TOPIC: ${topic}
SPEECH TYPE: ${speechType}
JUDGE PARADIGM: ${judgeParadigm || "flow judge, values technical debate"}
SPEECH: "${speechText}"

Return JSON with exactly these fields:
{
  "overallScore": <1-10>,
  "roundVerdict": "<would they win or lose this round and why — be blunt>",
  "technicalBreakdown": "<technical analysis: dropped arguments, conceded ground, voting issues>",
  "judgeAdaptation": "<how well did they adapt to the judge paradigm and what to change>",
  "criticalDrops": ["<arguments that were dropped or poorly answered that would cost the round>"],
  "eliteLevel": "<what separates this speech from a finals-level performance>",
  "theoryVulnerabilities": "<any procedural or theory arguments the opponent could run>",
  "speedClarity": "<assessment of their pacing and whether a fast judge could flow it>",
  "pressurePoints": "<the 2 moments in their speech where they would lose a close round>",
  "tournamentReady": <true/false>,
  "elimRoundFix": "<the single most important fix before their next elimination round>"
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
