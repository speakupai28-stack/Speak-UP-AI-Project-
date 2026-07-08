import { prisma } from "@/lib/prisma";

export const FREE_TIER_MONTHLY_SESSION_LIMIT = 5;

function startOfCurrentMonth(): Date {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function isFreeTierLimitReached(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true } });
  if (!user || user.plan !== "FREE") return false;

  const since = startOfCurrentMonth();
  const [debateCount, speakingCount] = await Promise.all([
    prisma.debateSessionRecord.count({ where: { progress: { userId }, date: { gte: since } } }),
    prisma.speakingSessionRecord.count({ where: { progress: { userId }, date: { gte: since } } }),
  ]);

  return debateCount + speakingCount >= FREE_TIER_MONTHLY_SESSION_LIMIT;
}
