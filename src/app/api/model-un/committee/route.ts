import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { speechContext, country, topic, speechText } = await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are an experienced Model UN coach. You give specific, actionable feedback on delegate speeches. Your tone is constructive and encouraging but direct. Always respond with valid JSON only — no markdown, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this MUN delegate's speech.

COUNTRY: ${country}
TOPIC: ${topic}
SPEECH TYPE: ${speechContext}
SPEECH: "${speechText}"

Return JSON with exactly these fields:
{
  "overallScore": <1-10>,
  "summary": "<2 sentences on overall quality and main opportunity>",
  "countryRepresentation": "<did they accurately represent their country's real position? Be specific>",
  "speechStructure": "<feedback on opening, body, close>",
  "diplomaticLanguage": "<feedback on their use of formal MUN language>",
  "strengths": ["<2-3 specific strengths>"],
  "improvements": ["<2-3 specific improvements>"],
  "improvedOpeningSentence": "<rewrite just their opening sentence to be stronger>",
  "suggestedOperativeClause": "<write one operative clause they could propose in a resolution>",
  "nextStep": "<one specific thing to practice before their conference>"
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
