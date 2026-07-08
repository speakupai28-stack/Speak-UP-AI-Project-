import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { serializeDebateProgress } from "@/lib/serializeProgress";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.debateProgress.findUnique({
    where: { userId: session.user.id },
    include: { sessions: { orderBy: { date: "asc" } } },
  });

  if (!progress) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(serializeDebateProgress(progress));
}
