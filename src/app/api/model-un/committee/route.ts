import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { speechContext, country, topic, speechText } = await req.json();

  const model = getModel(
    "You are an experienced Model UN coach. You give specific, actionable feedback on delegate speeches. Your tone is constructive and encouraging but direct. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Analyze this MUN delegate's speech.

COUNTRY: ${country}
TOPIC: ${topic}
SPEECH TYPE: ${speechContext}
SPEECH: "${speechText}"

Return JSON:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences on overall quality and main opportunity>",
  "countryRepresentation": "<did they accurately represent their country's real position?>",
  "speechStructure": "<feedback on opening, body, close>",
  "diplomaticLanguage": "<feedback on formal MUN language>",
  "strengths": ["<2-3 specific strengths>"],
  "improvements": ["<2-3 specific improvements>"],
  "improvedOpeningSentence": "<rewrite just their opening sentence stronger>",
  "suggestedOperativeClause": "<write one operative clause they could propose>",
  "nextStep": "<one specific thing to practice before their conference>"
}`
  );

  return NextResponse.json(parseJSON(result.response.text()));
}
