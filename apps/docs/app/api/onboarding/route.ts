// POST — called by the VINR API backend when a merchant makes their first
// sandbox API call. Phase 1: validates the shared secret and logs the event.
// Phase 2: correlate merchantId to a GA4 client_id and fire a Measurement
// Protocol event so the "first real call" appears in the onboarding funnel.
import { NextRequest } from "next/server";
import { checkOnboardingRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: NextRequest): Promise<Response> {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "anonymous";
  const limit = await checkOnboardingRateLimit(ip);
  if (!limit.ok) return new Response(null, { status: 429 });

  const secret = process.env.ONBOARDING_WEBHOOK_SECRET;
  // Reject if the secret is absent (misconfigured deploy) OR wrong (bad caller).
  // The old `if (secret && ...)` pattern made auth optional — a missing env var
  // silently opened the endpoint to everyone.
  if (!secret || req.headers.get("x-webhook-secret") !== secret) {
    return new Response(null, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  // Whitelist specific fields — never spread untrusted input into the log entry.
  // Spreading body lets a caller override `type`, `at`, or inject arbitrary keys
  // that poison log-drain parsers and (in Phase 2) corrupt the GA4 funnel.
  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const merchantId = typeof b.merchantId === "string" ? b.merchantId : null;
  const environment = typeof b.environment === "string" ? b.environment : null;
  const endpoint = typeof b.endpoint === "string" ? b.endpoint : null;

  console.log(
    JSON.stringify({
      type: "onboarding_first_call",
      merchantId,
      environment,
      endpoint,
      at: new Date().toISOString(),
    })
  );

  return new Response(null, { status: 204 });
}
