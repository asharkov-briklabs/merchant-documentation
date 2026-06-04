// Receives Content-Security-Policy violation reports from browsers.
// Browsers POST here automatically when a CSP directive is violated
// (configured via the `report-uri` directive in middleware.ts).
// The console.error log is picked up by Sentry's console integration.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let report: unknown;
  try {
    const text = await req.text();
    report = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  console.error(JSON.stringify({ type: "csp_violation", report }));

  return new Response(null, { status: 204 });
}
