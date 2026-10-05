// Sliding-window request limits. Storage is passed in (see aiLimits.ts for the
// database version), so the counting rules can be tested on their own.

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export interface UsageStore {
  countSince(key: string, since: Date): Promise<number>;
  record(key: string, route: string, at: Date): Promise<void>;
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/** Records the request if every rule still has room; refused requests aren't recorded. */
export async function takeRequest(
  store: UsageStore,
  key: string,
  route: string,
  rules: RateLimitRule[],
  now: Date = new Date(),
): Promise<RateLimitResult> {
  for (const rule of rules) {
    const used = await store.countSince(key, new Date(now.getTime() - rule.windowMs));
    if (used >= rule.limit) {
      return { ok: false, retryAfterSeconds: Math.ceil(rule.windowMs / 1000) };
    }
  }
  await store.record(key, route, now);
  return { ok: true };
}
