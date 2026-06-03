import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Abuse + cost protection for the public, unauthenticated /api/ask endpoint,
 * which calls a metered LLM API. Two layers:
 *
 *  1. Per-IP sliding-window limit (default 10 req / 60s).
 *  2. Global daily request cap — a hard ceiling across ALL callers so a
 *     distributed attack (many IPs) still can't run up an unbounded bill.
 *
 * Backed by Upstash Redis so the limit is DURABLE across Vercel's autoscaled,
 * cold-start-prone serverless instances. When the Upstash env vars are absent
 * (e.g. local dev), we fall back to a per-instance in-memory limiter — weaker,
 * but keeps dev frictionless instead of crashing.
 */

const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10);
const RATE_LIMIT_WINDOW_MS = parseInt(
  process.env.RATE_LIMIT_WINDOW_MS || "60000",
  10
);
const DAILY_CAP = parseInt(process.env.ASK_DAILY_REQUEST_CAP || "5000", 10);

// Feedback: low cost, human-paced. 5 req/60s is plenty.
const FEEDBACK_RATE_LIMIT_MAX = parseInt(
  process.env.FEEDBACK_RATE_LIMIT_MAX_REQUESTS || "5",
  10
);

// /api/md: public read (powers "Copy page" / "View as Markdown"). Generous
// enough for a user browsing many pages quickly.
const MD_RATE_LIMIT_MAX = parseInt(
  process.env.MD_RATE_LIMIT_MAX_REQUESTS || "60",
  10
);

// /api/onboarding: backend webhook — one call per merchant's first API call,
// capped to absorb retries without opening it to abuse.
const ONBOARDING_RATE_LIMIT_MAX = parseInt(
  process.env.ONBOARDING_RATE_LIMIT_MAX_REQUESTS || "20",
  10
);

const WINDOW_SECONDS = Math.max(1, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));

export type RateLimitResult =
  | { ok: true }
  | { ok: false; reason: "rate_limit" | "global_cap" };

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis: Redis | null = null;
let limiter: Ratelimit | null = null;

let feedbackLimiter: Ratelimit | null = null;
let mdLimiter: Ratelimit | null = null;
let onboardingLimiter: Ratelimit | null = null;

if (hasUpstash) {
  redis = Redis.fromEnv();
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, `${WINDOW_SECONDS} s`),
    prefix: "ask:rl",
  });
  feedbackLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(FEEDBACK_RATE_LIMIT_MAX, `${WINDOW_SECONDS} s`),
    prefix: "feedback:rl",
  });
  mdLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(MD_RATE_LIMIT_MAX, `${WINDOW_SECONDS} s`),
    prefix: "md:rl",
  });
  onboardingLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(ONBOARDING_RATE_LIMIT_MAX, `${WINDOW_SECONDS} s`),
    prefix: "onboarding:rl",
  });
}

// ---- In-memory fallback (no Upstash configured) -------------------------
// Per-instance only; resets on cold start. Mirrors the limiter the route used
// before Upstash, kept solely so local dev works without Redis.
let warnedNoUpstash = false;
const memMap = new Map<string, { count: number; resetAt: number }>();

function memCheck(key: string, max = RATE_LIMIT_MAX): RateLimitResult {
  if (!warnedNoUpstash) {
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — falling back to " +
        "in-memory per-instance rate limiting. This is NOT durable; configure " +
        "Upstash before relying on it for abuse protection in production."
    );
    warnedNoUpstash = true;
  }
  const now = Date.now();
  // Evict expired entries to prevent unbounded growth on long-lived instances.
  for (const [k, v] of memMap) {
    if (now > v.resetAt) memMap.delete(k);
  }
  const entry = memMap.get(key);
  if (!entry || now > entry.resetAt) {
    memMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= max) return { ok: false, reason: "rate_limit" };
  entry.count++;
  return { ok: true };
}

/** Increment and check the global daily request counter (Upstash only). */
async function underGlobalCap(): Promise<boolean> {
  if (!redis) return true;
  const day = new Date().toISOString().slice(0, 10); // UTC YYYY-MM-DD
  const key = `ask:global:${day}`;
  const count = await redis.incr(key);
  if (count === 1) {
    // First hit of the day — expire after 48h so old counters self-clean.
    await redis.expire(key, 60 * 60 * 48);
  }
  return count <= DAILY_CAP;
}

/**
 * Check whether a feedback request from `key` may proceed (per-IP only, no
 * global cap — the endpoint has no external cost). Fails open on Upstash error.
 */
export async function checkFeedbackRateLimit(key: string): Promise<RateLimitResult> {
  if (!feedbackLimiter) return memCheck(key, FEEDBACK_RATE_LIMIT_MAX);
  try {
    const { success } = await feedbackLimiter.limit(key);
    return success ? { ok: true } : { ok: false, reason: "rate_limit" };
  } catch {
    return { ok: true };
  }
}

/** Rate-limit for /api/md (public read, powers "Copy page"). Fails open on error. */
export async function checkMdRateLimit(key: string): Promise<RateLimitResult> {
  if (!mdLimiter) return memCheck(key, MD_RATE_LIMIT_MAX);
  try {
    const { success } = await mdLimiter.limit(key);
    return success ? { ok: true } : { ok: false, reason: "rate_limit" };
  } catch {
    return { ok: true };
  }
}

/** Rate-limit for /api/onboarding (backend webhook). Fails open on error. */
export async function checkOnboardingRateLimit(key: string): Promise<RateLimitResult> {
  if (!onboardingLimiter) return memCheck(key, ONBOARDING_RATE_LIMIT_MAX);
  try {
    const { success } = await onboardingLimiter.limit(key);
    return success ? { ok: true } : { ok: false, reason: "rate_limit" };
  } catch {
    return { ok: true };
  }
}

/**
 * Check whether a request from `key` (typically the client IP) may proceed.
 * Applies the per-IP limit first, then the global daily cap. If Upstash is
 * unreachable we fail OPEN (allow) rather than taking the assistant down — the
 * in-memory layer and origin check still apply at the route.
 */
export async function checkAskRateLimit(key: string): Promise<RateLimitResult> {
  if (!limiter) return memCheck(key);

  try {
    const { success } = await limiter.limit(key);
    if (!success) return { ok: false, reason: "rate_limit" };
    if (!(await underGlobalCap())) return { ok: false, reason: "global_cap" };
    return { ok: true };
  } catch (err) {
    // Redis hiccup — don't hard-fail the endpoint over a transient store error.
    console.error("[rate-limit] Upstash error, failing open:", err);
    return { ok: true };
  }
}
