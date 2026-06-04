import { NextResponse, type NextRequest } from "next/server";

/**
 * Per-request Content-Security-Policy with a cryptographic nonce.
 *
 * Why middleware and not next.config headers():
 *   Static headers() emits the same CSP string for every request, so any
 *   nonce would be reused — defeating the purpose. Middleware runs on every
 *   request and can generate a fresh nonce each time.
 *
 * Script-src strategy — 'strict-dynamic' + nonce:
 *   Modern browsers (CSP3): only the nonce and scripts it transitively loads
 *   are trusted. 'unsafe-inline' and domain allowlists are IGNORED.
 *   Legacy browsers (CSP2 fallback): 'unsafe-inline' applies.
 *   This is the Google-recommended "strict CSP" approach.
 *
 * The nonce is forwarded as x-nonce on the request so the root layout
 * (a React Server Component) can read it via headers() and inject
 * <meta property="csp-nonce"> — Next.js uses that meta tag to nonce its
 * own internal hydration/RSC inline scripts automatically.
 *
 * x-pathname is forwarded so the docs layout can scope the sidebar tree
 * to the current section without receiving it as a route param.
 *
 * CSP violations are reported to /api/csp-report (browser POST, logged
 * to console, picked up by Sentry's console integration).
 */

// Update this record when adding or removing third-party services.
// script: domains loaded as <script src="...">
// connect: domains reached via fetch/XHR/WebSocket
const THIRD_PARTY: Record<string, { script?: string[]; connect?: string[] }> = {
  "google-analytics": {
    script: ["https://www.googletagmanager.com"],
    connect: ["https://www.google-analytics.com", "https://www.googletagmanager.com"],
  },
  "clarity": {
    script: ["https://www.clarity.ms"],
    // r.clarity.ms = reporting endpoint; c/p.bing.com = click and nav signals
    connect: ["https://www.clarity.ms", "https://r.clarity.ms", "https://c.bing.com", "https://p.bing.com"],
  },
  "sentry": {
    connect: ["https://*.sentry.io", "https://*.ingest.sentry.io"],
  },
};

const scriptHosts = Object.values(THIRD_PARTY).flatMap(s => s.script ?? []).join(" ");
const connectHosts = Object.values(THIRD_PARTY).flatMap(s => s.connect ?? []).join(" ");

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    // 'strict-dynamic' causes modern browsers to ignore 'unsafe-inline' and
    // domain allowlists — those are retained as CSP2 legacy fallbacks only.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} 'unsafe-inline' ${scriptHosts}`,
    "style-src 'self' 'unsafe-inline'",
    // blob: covers Next.js image optimisation intermediate output.
    // data: covers inline SVG and base64-embedded images in MDX.
    "img-src 'self' data: blob: https://www.google-analytics.com",
    "font-src 'self'",
    `connect-src 'self' ${connectHosts}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    // Browsers POST violation reports here; see app/api/csp-report/route.ts
    "report-uri /api/csp-report",
  ].join("; ");
}

function generateNonce(): string {
  // Edge runtime: Web Crypto API only (no Node.js Buffer).
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return btoa(Array.from(bytes, b => String.fromCharCode(b)).join(""));
}

export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward both headers to Server Components via the request context.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

// Apply to all page routes. Skip:
//   _next/static  — pre-built JS/CSS bundles (no HTML, no inline scripts)
//   _next/image   — image optimisation responses
//   favicon.ico   — icon file
// Prefetch requests are excluded via the `missing` clause — the nonce and
// pathname on a prefetch response are discarded, so running middleware on
// them is wasted work.
export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon\\.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
