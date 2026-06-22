import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
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

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: `You are an expert debate coach and public speaking instructor. Always respond with valid JSON only — no markdown, no explanation, no code fences.`,
    messages: [
      {
        role: "user",
        content: `Build a personalized learning profile for this student.

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
}

Be specific and match the tone to their level — simple and energetic for beginners, technical and strategic for advanced students.`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "No profile generated" }, { status: 500 });
  }

  const profile: OnboardingProfile = JSON.parse(textBlock.text);
  return NextResponse.json(profile);
}
