import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import type { ResearchAnalysis } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { country, committee, topic, historicalStance, bloc, speakerPosition, experience } =
    await req.json();

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 2048,
    system: `You are an expert Model UN coach and researcher. You teach students how to research smartly and build strong position papers. Always respond with valid JSON only — no markdown, no explanation, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Analyze this student's Model UN research situation and create a comprehensive, personalized research guide.

STUDENT INFO:
- Experience Level: ${experience ?? "not specified"}
- Country Representing: ${country}
- Committee: ${committee}
- Topic / Agenda Item: ${topic}
${bloc ? `- Bloc / Alliance: ${bloc}` : ""}
${speakerPosition ? `- Speaker Position: ${speakerPosition}` : ""}

WHAT THE STUDENT ALREADY KNOWS ABOUT THEIR COUNTRY'S STANCE:
${historicalStance || "Nothing provided yet."}

Based on everything above, build a thorough research guide. Use what the student already knows and build on it — don't repeat what they told you, extend it. If they got something wrong, gently correct it.

Return a JSON object with exactly these fields:
{
  "summary": "2-3 sentence overview of the research challenge for this specific country/topic/committee combo",
  "historicalContext": "A detailed paragraph on this country's real historical relationship with this topic — what positions they've taken at the UN, key votes, treaties signed or rejected, regional context. Build on what the student wrote and fill in gaps.",
  "researchRoadmap": [
    { "step": 1, "title": "short step title", "description": "what to do and why, specific to this country and topic" },
    { "step": 2, "title": "...", "description": "..." },
    { "step": 3, "title": "...", "description": "..." },
    { "step": 4, "title": "...", "description": "..." },
    { "step": 5, "title": "...", "description": "..." }
  ],
  "keySources": [
    { "name": "source name", "urlHint": "e.g. un.org, government domain, or organization name", "why": "why this source is useful for this specific topic" },
    ... (4-6 sources)
  ],
  "allies": ["country1", "country2", "country3", "country4"],
  "adversaries": ["country1", "country2", "country3"],
  "keyTalkingPoints": ["specific talking point 1", "specific talking point 2", "specific talking point 3", "specific talking point 4"],
  "positionPaperTips": ["tip 1 specific to this country/topic", "tip 2", "tip 3", "tip 4"],
  "smartResearchTips": ["efficient research tip 1", "efficient research tip 2", "efficient research tip 3"]
}

Be highly specific to the actual country, committee, and topic. Do not give generic advice.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No analysis generated" }, { status: 500 });
  }

  const analysis: ResearchAnalysis = JSON.parse(textBlock.text);
  return NextResponse.json(analysis);
}
