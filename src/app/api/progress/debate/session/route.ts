import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { XP_PER_SESSION } from "@/lib/progress";
import { serializeDebateProgress } from "@/lib/serializeProgress";
import { isFreeTierLimitReached } from "@/lib/planLimits";

const sessionSchema = z.object({
  type: z.enum(["speech", "sparring", "rebuttal", "case_builder"]),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  topic: z.string().min(1),
  score: z.number().min(0).max(10),
  weaknesses: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = sessionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { type, level, topic, score, weaknesses } = parsed.data;

  if (await isFreeTierLimitReached(session.user.id)) {
    return NextResponse.json(
      { error: "upgrade_required", message: "You've used all 5 free sessions this month." },
      { status: 402 }
    );
  }

  const progress = await prisma.debateProgress.findUnique({
    where: { userId: session.user.id },
  });
  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newXp = Math.min(progress.xp + XP_PER_SESSION[type], 100);
  const updatedWeaknesses = { ...((progress.weaknesses as Record<string, number>) ?? {}) };
  weaknesses.forEach((w) => {
    updatedWeaknesses[w] = (updatedWeaknesses[w] ?? 0) + 1;
  });

  const updated = await prisma.debateProgress.update({
    where: { id: progress.id },
    data: {
      xp: newXp,
      weaknesses: updatedWeaknesses,
      sessions: { create: { type, level, topic, score, weaknesses } },
    },
    include: { sessions: { orderBy: { date: "asc" } } },
  });

  return NextResponse.json(serializeDebateProgress(updated));
}
