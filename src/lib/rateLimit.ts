// Sliding-window request limits. Storage is passed in (see aiLimits.ts for the
// database version), so the counting rules can be tested on their own.

export interface RateLimitRule {
  limit: number;
  windowMs: number;
}

export interface UsageStore {
  countSince(key: string, since: Date): Promise<number>;
  /** Saves one request and returns its id. */
  record(key: string, route: string, at: Date): Promise<string>;
  remove(id: string): Promise<void>;
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSeconds: number };

/**
 * Records the request first and then counts, so requests that arrive at the same
 * moment all see each other and can't slip past the limit together. If any rule is
 * over, the record is removed again, so refused requests don't use up the window.
 */
export async function takeRequest(
  store: UsageStore,
  key: string,
  route: string,
  rules: RateLimitRule[],
  now: Date = new Date(),
): Promise<RateLimitResult> {
  const id = await store.record(key, route, now);
  for (const rule of rules) {
    const used = await store.countSince(key, new Date(now.getTime() - rule.windowMs));
    if (used > rule.limit) {
      await store.remove(id);
      return { ok: false, retryAfterSeconds: Math.ceil(rule.windowMs / 1000) };
    }
  }
  return { ok: true };
}

/**
 * True when the request body is bigger than maxBytes. The Content-Length header
 * can be missing (chunked uploads) or wrong, so the body itself is measured; clone()
 * leaves the original body for the route's own req.json(). Reading stops as soon as
 * the limit is passed, so a huge or endless upload never gets buffered in full.
 */
export async function bodyTooLarge(req: Request, maxBytes: number): Promise<boolean> {
  if (Number(req.headers.get("content-length") ?? 0) > maxBytes) return true;
  const reader = req.clone().body?.getReader();
  if (!reader) return false;
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return false;
    size += value.byteLength;
    if (size > maxBytes) {
      // Not awaited: cancelling one branch of a cloned body only settles once the
      // other branch is cancelled too, which the route never does.
      reader.cancel().catch(() => {});
      return true;
    }
  }
}
