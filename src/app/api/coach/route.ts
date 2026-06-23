import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

const FOCUS_LABELS: Record<string, string> = {
  debate: "Competitive Debate",
  "model-un": "Model UN",
  "public-speaking": "Public Speaking",
};

const GOAL_LABELS: Record<string, string> = {
  competition: "competition preparation and tournament performance",
  class: "school assignments and class requirements",
  improvement: "personal growth and building long-term communication skills",
  explore: "exploring what coaching can do for them",
};

export async function POST(req: NextRequest) {
  const { messages, profile } = await req.json();

  const { name, experience, focus, goal, aiProfile } = profile;

  const focusAreas = (focus as string[]).map((f: string) => FOCUS_LABELS[f] ?? f).join(", ");
  const goalContext = GOAL_LABELS[goal] ?? goal;

  const systemPrompt = `You are a personal coach for ${name}, a ${experience}-level student focused on: ${focusAreas}. Their main goal is ${goalContext}.

Here is what you already know about ${name} from their onboarding:
- Coaching style they need: ${aiProfile?.coachingStyle ?? "personalized and encouraging"}
- Their weekly goal: ${aiProfile?.weeklyGoal ?? "improve their skills"}
- Top skills to build: ${(aiProfile?.topFocusSkills as string[])?.join(", ") ?? "core communication skills"}
- Key insight 1: ${(aiProfile?.personalizedInsights as string[])?.[0] ?? ""}
- Key insight 2: ${(aiProfile?.personalizedInsights as string[])?.[1] ?? ""}

Your role:
- You are ONLY a coach for their chosen areas: ${focusAreas}. Do not give generic advice — everything you say must connect directly to their specific focus areas and goals.
- Speak to ${name} by name occasionally to make it feel personal.
- Match their level: ${experience === "beginner" ? "explain things simply and encourage every attempt" : experience === "intermediate" ? "push for strategic thinking and challenge weak spots" : "be direct, technical, and hold them to a high standard"}.
- When they ask for help with a specific skill, give them a concrete drill, example, or framework they can use immediately.
- When they share something they wrote or said, give specific, actionable feedback — not generic praise.
- Keep responses conversational and focused — 3-5 sentences unless they ask for more detail.
- You remember everything from this conversation. Build on previous exchanges.
- If they ask about something outside your coaching areas, gently redirect: "That's outside what I coach, but for your ${focusAreas} work..."`;

  const formattedMessages = (messages as { role: string; content: string }[]).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const message = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 512,
    system: systemPrompt,
    messages: formattedMessages,
  });

  const textBlock = message.content.find((b) => b.type === "text");
  return NextResponse.json({ response: textBlock?.type === "text" ? textBlock.text : "" });
}
