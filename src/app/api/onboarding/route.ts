import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { OnboardingProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { name, experience, focus, goal } = await req.json();

  const focusLabel: Record<string, string> = {
    debate: "Competitive Debate",
    "model-un": "Model UN",
    "public-speaking": "Public Speaking & Coaching",
  };
  const goalLabel: Record<string, string> = {
    competition: "Competition Preparation",
    class: "School / Class Requirement",
    improvement: "Personal Growth",
    explore: "Exploring SpeakUP Coaching",
  };

  const focusNames = (focus as string[]).map((f) => focusLabel[f] ?? f).join(", ");
  const goalName = goalLabel[goal] ?? goal;

  const model = getModel(
    "You are an expert debate coach and public speaking instructor building a personalized learning profile for a new student. Always respond with valid JSON only — no markdown, no code fences."
  );

  const result = await model.generateContent(
    `Build a personalized learning profile for this student.

Student Survey:
- Name: ${name}
- Experience Level: ${experience}
- Focus Areas: ${focusNames}
- Main Goal: ${goalName}

Return a JSON object with exactly these fields:
{
  "greeting": "A warm 1-sentence welcome using their name",
  "tagline": "A motivational tagline under 10 words",
  "recommendedStart": "The best first activity and why (1 sentence)",
  "topFocusSkills": ["skill1", "skill2", "skill3"],
  "weeklyGoal": "One specific measurable goal for their first week",
  "coachingStyle": "How to coach this student (1-2 sentences)",
  "difficultyLevel": "beginner | intermediate | advanced",
  "personalizedInsights": ["insight1", "insight2"],
  "firstChallengeTitle": "A catchy challenge title",
  "firstChallengeDescription": "What the first challenge involves (1 sentence)"
}`
  );

  const profile = parseJSON<OnboardingProfile>(result.response.text());
  return NextResponse.json(profile);
}
