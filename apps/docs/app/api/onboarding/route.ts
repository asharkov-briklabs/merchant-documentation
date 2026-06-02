// POST — called by the VINR API backend when a merchant makes their first
// sandbox API call. Phase 1: validates the shared secret and logs the event.
// Phase 2: correlate merchantId to a GA4 client_id and fire a Measurement
// Protocol event so the "first real call" appears in the onboarding funnel.
export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  const secret = process.env.ONBOARDING_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-webhook-secret") !== secret) {
    return new Response(null, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  console.log(
    JSON.stringify({
      type: "onboarding_first_call",
      ...(body as Record<string, unknown>),
      at: new Date().toISOString(),
    })
  );

  return new Response(null, { status: 204 });
}
