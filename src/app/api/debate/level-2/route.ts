import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText } = await req.json();

  const model = getModel(
    "You are a demanding debate coach for intermediate students. You push back on weak arguments, identify strategic gaps, and force students to think deeper. Be direct and specific. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Analyze this intermediate debater's speech with a strategic lens.

TOPIC: ${topic}
SPEECH TYPE: ${speechType}
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "verdict": "<1 sentence strategic verdict — direct and honest>",
  "strategicStrengths": ["<what strategic moves worked>"],
  "weaknesses": ["<strategic gaps the opponent would exploit>"],
  "missedOpportunities": ["<turns or offensive moves they could have run>"],
  "timeAllocation": "<feedback on how they spent their argument>",
  "flowAnalysis": "<what would be winning/losing on the flow right now>",
  "challengeQuestion": "<one hard cross-ex question an opponent would use>",
  "improvedVersion": "<rewrite their weakest argument strategically — 3-4 sentences>",
  "nextDrill": "<one specific drill to fix their biggest weakness>"
}`
  );

  return NextResponse.json(parseJSON(result.response.text()));
}
