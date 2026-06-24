import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { DebateLevel1Feedback } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { topic, speechType, speechText } = await req.json();

  const model = getModel(
    "You are an encouraging debate coach for complete beginners. Your tone is warm, supportive, and simple. You never overwhelm students — celebrate what they got right and give one or two clear improvements at a time. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Analyze this beginner debater's speech using the CWI model (Claim, Warrant, Impact).

DEBATE TOPIC: ${topic}
SPEECH TYPE: ${speechType}
STUDENT'S SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10, be generous with beginners>,
  "encouragement": "<1-2 warm sentences celebrating what they attempted>",
  "claimAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote from their speech that is the claim, or empty string>",
    "feedback": "<simple 1-sentence explanation>"
  },
  "warrantAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote or empty string>",
    "feedback": "<simple 1-sentence explanation>"
  },
  "impactAnalysis": {
    "found": <true/false>,
    "quote": "<exact quote or empty string>",
    "feedback": "<simple 1-sentence explanation>"
  },
  "strengths": ["<1-2 specific things they did well>"],
  "improvements": ["<1-2 specific actionable improvements>"],
  "rewriteExample": "<rewrite their weakest part to show them how — 2-3 sentences>",
  "nextStep": "<one clear thing to practice next time>"
}`
  );

  const feedback = parseJSON<DebateLevel1Feedback>(result.response.text());
  return NextResponse.json(feedback);
}
