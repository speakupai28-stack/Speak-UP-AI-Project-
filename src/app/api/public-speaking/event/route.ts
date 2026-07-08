import { NextRequest, NextResponse } from "next/server";
import { getModel, parseJSON } from "@/lib/gemini";
import type { EventFeedback } from "@/lib/types";

const EVENT_CRITERIA: Record<string, string> = {
  "Self-Introduction": "clarity, warmth, and memorability",
  "Class Presentation": "structure, evidence quality, and audience engagement",
  "Valedictorian Speech": "personal story, inspiration, and emotional resonance",
  "TEDx-Style Talk": "one clear big idea, narrative arc, and delivery energy",
  "Persuasive Speech": "ethos/pathos/logos balance and a strong call to action",
  "Informative Speech": "clarity, logical organisation, and audience-appropriate language",
  "Debate Opening Statement": "framing the debate, confidence, and argument preview",
  "Model UN Opening Speech": "formal diplomatic language and country representation",
  "College Interview Answer": "specificity, authenticity, and concise storytelling",
  "Elevator Pitch": "hook, value proposition, and memorable close in under 60 seconds",
};

const LEVEL_STANDARD: Record<number, string> = {
  1: "Be encouraging. Reward structure and effort. Focus on whether the basic requirements of the event are met.",
  2: "Evaluate at an intermediate standard. Expect personality, specific examples, and clear event structure.",
  3: "Judge at a competition/real audience standard. Only award high scores for speeches that would genuinely impress.",
};

export async function POST(req: NextRequest) {
  const { eventType, speechText, level } = await req.json();
  const criteria = EVENT_CRITERIA[eventType] ?? "overall clarity and impact";

  const model = getModel(
    `You are a judge and speaking coach for the event: ${eventType}. ${LEVEL_STANDARD[level] ?? LEVEL_STANDARD[1]} Always respond with valid JSON only — no markdown, no code fences.`
  );

  const result = await model.generateContent(
    `Evaluate this Level ${level} student's ${eventType} speech.

This event is judged on: ${criteria}

SPEECH: "${speechText}"

Return JSON:
{
  "event": "${eventType}",
  "overallScore": <1-10>,
  "judgeVerdict": "<1-2 sentences: would this speech succeed at this event?>",
  "eventSpecificFeedback": "<how well did they meet the specific requirements of a ${eventType}?>",
  "strengths": ["<2-3 things that worked well for this event>"],
  "improvements": ["<2-3 specific improvements for this event format>"],
  "openingRewrite": "<rewrite their opening line to immediately fit the ${eventType} format>",
  "closingRewrite": "<rewrite their closing to land perfectly for a ${eventType}>",
  "weakness": "<the single biggest weakness for this event type>"
}`
  );

  const feedback = parseJSON<EventFeedback>(result.response.text());
  return NextResponse.json(feedback);
}
