import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { ResearchAnalysis } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { country, committee, topic, historicalStance, bloc, speakerPosition, experience } = await req.json();

  const model = getModel(
    "You are an expert Model UN coach and researcher. You teach students how to research smartly and build strong position papers. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Analyze this student's Model UN research situation and create a comprehensive, personalized research guide.

STUDENT INFO:
- Experience Level: ${experience ?? "not specified"}
- Country Representing: ${country}
- Committee: ${committee}
- Topic / Agenda Item: ${topic}
${bloc ? `- Bloc / Alliance: ${bloc}` : ""}
${speakerPosition ? `- Speaker Position: ${speakerPosition}` : ""}

WHAT THE STUDENT ALREADY KNOWS:
${historicalStance || "Nothing provided yet."}

Return JSON:
{
  "summary": "2-3 sentence overview of the research challenge",
  "historicalContext": "Detailed paragraph on this country's real historical relationship with this topic",
  "researchRoadmap": [
    { "step": 1, "title": "step title", "description": "what to do and why" },
    { "step": 2, "title": "...", "description": "..." },
    { "step": 3, "title": "...", "description": "..." },
    { "step": 4, "title": "...", "description": "..." },
    { "step": 5, "title": "...", "description": "..." }
  ],
  "keySources": [
    { "name": "source name", "urlHint": "domain or org name", "why": "why useful" }
  ],
  "allies": ["country1", "country2", "country3", "country4"],
  "adversaries": ["country1", "country2", "country3"],
  "keyTalkingPoints": ["point1", "point2", "point3", "point4"],
  "positionPaperTips": ["tip1", "tip2", "tip3", "tip4"],
  "smartResearchTips": ["tip1", "tip2", "tip3"]
}`
  );

  const analysis = parseJSON<ResearchAnalysis>(result.response.text());
  return NextResponse.json(analysis);
}
