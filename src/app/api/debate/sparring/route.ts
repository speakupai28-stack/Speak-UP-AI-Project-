import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceAiLimits } from "@/lib/aiLimits";
import { anthropic } from "@/lib/anthropic";
import type { SparringMessage } from "@/lib/types";

const LEVEL_OPPONENT: Record<number, string> = {
  1: "You are a beginner-friendly debate opponent. Make clear, simple arguments. Ask one POI at a time. Don't overwhelm the student — your job is to challenge them just enough to practice refutation. Acknowledge good points.",
  2: "You are a skilled intermediate debate opponent. Run strategic arguments, fire targeted cross-examination questions, identify and exploit weak points in their case. Push back hard on unsupported claims.",
  3: "You are a competition-level debate opponent. You are relentless — run turns, attack their framing, ask rapid POIs, and exploit every dropped argument. Act like a finalist who wants to win.",
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const limited = await enforceAiLimits(req, `user:${session.user.id}`, "debate/sparring");
  if (limited) return limited;

  const { motion, studentSide, messages, level } = await req.json();

  const opponentSide = studentSide === "Proposition" ? "Opposition" : "Proposition";

  const systemPrompt = `${LEVEL_OPPONENT[level] ?? LEVEL_OPPONENT[1]}

You are debating the ${opponentSide} side of: "${motion}"
The student is ${studentSide}.

Rules:
- Stay in character as a debater, not a coach
- Keep responses to 3-5 sentences — this is a debate, not an essay
- Occasionally include a POI in brackets like [POI: "Are you suggesting that...?"]
- Attack their arguments specifically, not generically
- Never break character to give coaching advice during the round`;

  const formattedMessages = (messages as SparringMessage[]).map((m) => ({
    role: (m.role === "student" ? "user" : "assistant") as "user" | "assistant",
    content: m.content,
  }));

  const anthropicStream = anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 512,
    system: systemPrompt,
    messages: formattedMessages.length > 0 ? formattedMessages : [
      {
        role: "user",
        content: "Begin the debate. Deliver your opening argument.",
      },
    ],
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    start(controller) {
      anthropicStream.on("text", (textDelta) => {
        controller.enqueue(encoder.encode(textDelta));
      });
      anthropicStream.on("end", () => controller.close());
      anthropicStream.on("error", (err) => controller.error(err));
    },
    cancel() {
      anthropicStream.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
