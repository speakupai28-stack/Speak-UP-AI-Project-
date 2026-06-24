import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import type { SparringMessage } from "@/lib/types";

const LEVEL_OPPONENT: Record<number, string> = {
  1: "You are a beginner-friendly debate opponent. Make clear, simple arguments. Ask one POI at a time. Don't overwhelm the student. Acknowledge good points.",
  2: "You are a skilled intermediate debate opponent. Run strategic arguments, fire targeted cross-examination questions, identify and exploit weak points. Push back hard on unsupported claims.",
  3: "You are a competition-level debate opponent. You are relentless — run turns, attack their framing, ask rapid POIs, and exploit every dropped argument.",
};

export async function POST(req: NextRequest) {
  const { motion, studentSide, messages, level } = await req.json();

  const opponentSide = studentSide === "Affirmative" ? "Negative" : "Affirmative";

  const model = getModel(
    `${LEVEL_OPPONENT[level] ?? LEVEL_OPPONENT[1]}

You are debating the ${opponentSide} side of: "${motion}"
The student is ${studentSide}.

Rules:
- Stay in character as a debater, not a coach
- Keep responses to 3-5 sentences
- Occasionally include a POI in brackets like [POI: "Are you suggesting that...?"]
- Attack their arguments specifically, not generically
- Never break character to give coaching advice during the round`
  );

  const history = (messages as SparringMessage[]).slice(0, -1).map((m) => ({
    role: m.role === "student" ? "user" as const : "model" as const,
    parts: [{ text: m.content }],
  }));

  const lastMessage = (messages as SparringMessage[]).at(-1);
  const userText = lastMessage?.role === "student"
    ? lastMessage.content
    : "Begin the debate. Deliver your opening argument.";

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(userText);

  return NextResponse.json({ response: result.response.text() });
}
