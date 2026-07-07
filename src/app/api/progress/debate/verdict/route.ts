import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeDebateProgress } from "@/lib/serializeProgress";

const verdictSchema = z.object({
  verdict: z.enum(["advance", "stay", "drop"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = verdictSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const progress = await prisma.debateProgress.findUnique({
    where: { userId: session.user.id },
  });
  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let newLevel = progress.level;
  if (parsed.data.verdict === "advance" && progress.level < 3) newLevel = progress.level + 1;
  if (parsed.data.verdict === "drop") newLevel = 1;

  const updated = await prisma.debateProgress.update({
    where: { id: progress.id },
    data: { level: newLevel, xp: 0 },
    include: { sessions: { orderBy: { date: "asc" } } },
  });

  return NextResponse.json(serializeDebateProgress(updated));
}
