import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { bodyTooLarge, takeRequest, type RateLimitRule, type UsageStore } from "@/lib/rateLimit";

const MINUTE = 60_000;

// Per logged-in user, across all AI routes.
export const USER_LIMITS: RateLimitRule[] = [
  { limit: 30, windowMs: 10 * MINUTE },
  { limit: 300, windowMs: 24 * 60 * MINUTE },
];

// Onboarding runs before the account exists, so it's limited per IP address.
export const ONBOARDING_LIMITS: RateLimitRule[] = [{ limit: 10, windowMs: 60 * MINUTE }];

// Speeches and debate cases are text; 64 KB is roughly 10,000 words.
const MAX_BODY_BYTES = 64 * 1024;

const store: UsageStore = {
  countSince: (key, since) => prisma.aiUsage.count({ where: { key, createdAt: { gte: since } } }),
  record: async (key, route, at) =>
    (await prisma.aiUsage.create({ data: { key, route, createdAt: at }, select: { id: true } })).id,
  remove: async (id) => {
    await prisma.aiUsage.deleteMany({ where: { id } });
  },
};

/** Returns a response to send back if the request is over a limit, or null to continue. */
export async function enforceAiLimits(
  req: NextRequest,
  key: string,
  route: string,
  rules: RateLimitRule[] = USER_LIMITS,
): Promise<NextResponse | null> {
  if (await bodyTooLarge(req, MAX_BODY_BYTES)) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  try {
    const result = await takeRequest(store, key, route, rules);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a bit and try again." },
        { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
      );
    }
  } catch (err) {
    // Fail open: if the AiUsage table doesn't exist yet (prisma db push not run) or the
    // database hiccups, keep the feature working rather than refusing everyone.
    console.error("AI rate limit check failed; allowing the request.", err);
  }
  return null;
}

/** The caller's IP on Vercel (first x-forwarded-for entry). */
export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
