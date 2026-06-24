import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText, judgeParadigm } = await req.json();

  const model = getModel(
    "You are a brutally honest competition debate coach. You coach students preparing for elimination rounds. No sugar-coating — if an argument would lose the round, say so clearly. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Give elite-level tournament feedback on this speech.

TOPIC: ${topic}
SPEECH TYPE: ${speechType}
JUDGE PARADIGM: ${judgeParadigm || "flow judge, values technical debate"}
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "roundVerdict": "<would they win or lose this round — be blunt>",
  "technicalBreakdown": "<technical analysis: dropped args, conceded ground, voting issues>",
  "judgeAdaptation": "<how well did they adapt to the judge paradigm>",
  "criticalDrops": ["<arguments dropped that would cost the round>"],
  "eliteLevel": "<what separates this from a finals-level performance>",
  "theoryVulnerabilities": "<procedural arguments the opponent could run>",
  "speedClarity": "<assessment of pacing and whether a judge could flow it>",
  "pressurePoints": "<2 moments in their speech where they would lose a close round>",
  "tournamentReady": <true/false>,
  "elimRoundFix": "<the single most important fix before their next elimination round>"
}`
  );

  return NextResponse.json(parseJSON(result.response.text()));
}
