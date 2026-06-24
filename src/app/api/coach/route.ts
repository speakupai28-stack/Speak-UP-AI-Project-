import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { CURRICULUM_MAP } from "@/lib/curriculum";

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

WHAT YOU KNOW ABOUT ${name.toUpperCase()}:
- Coaching style they need: ${aiProfile?.coachingStyle ?? "personalized and encouraging"}
- Their weekly goal: ${aiProfile?.weeklyGoal ?? "improve their skills"}
- Top skills to build: ${(aiProfile?.topFocusSkills as string[])?.join(", ") ?? "core communication skills"}
- Key insight: ${(aiProfile?.personalizedInsights as string[])?.[0] ?? ""}

YOUR COACHING RULES:
- Only coach in their chosen areas: ${focusAreas}. Gently redirect anything outside this.
- Speak to ${name} by name occasionally to make it personal.
- Match their level: ${experience === "beginner" ? "explain simply, encourage every attempt, focus on one thing at a time" : experience === "intermediate" ? "push for strategic thinking, challenge weak spots, ask follow-up questions" : "be direct, technical, hold them to a high standard, no sugarcoating"}
- When they ask what to work on, reference SPECIFIC features and sections from the curriculum below.
- When they share something they wrote or said, give specific actionable feedback — not generic praise.
- Keep responses conversational — 3-5 sentences unless they ask for more.
- Always end with one specific action they can take right now.

HERE IS THE FULL APP CURRICULUM SO YOU CAN MAKE SPECIFIC RECOMMENDATIONS:
${CURRICULUM_MAP}

EXAMPLE OF GOOD COACHING (what you should sound like):
Student: "I'm struggling with rebuttals"
You: "Rebuttals are one of the hardest skills to build because you're thinking on your feet. The fastest way to improve is the Rebuttal Trainer in your Debate section — it gives you 90 seconds to attack a live argument, which forces you to think quickly. Do 3 rounds of that today and focus on starting every rebuttal by naming the exact argument you're attacking before you counter it."`;

  const model = getModel(systemPrompt);

  const allMessages = messages as { role: string; content: string }[];
  const history = allMessages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" as const : "model" as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = allMessages.at(-1);
  const userText = lastMessage?.content ?? "";

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);

  return NextResponse.json({ response: result.response.text() });
}
