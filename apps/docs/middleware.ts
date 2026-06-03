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
 * AnalyticsScripts uses document.createElement('script') — those dynamically
 * created elements are trusted under 'strict-dynamic' because they are
 * created by code that runs inside a nonced bundle.
 */

function buildCsp(nonce: string): string {
  const isDev = process.env.NODE_ENV === "development";
  return [
    "default-src 'self'",
    // 'strict-dynamic' causes modern browsers to ignore 'unsafe-inline' and
    // domain allowlists below — they are retained as CSP2 legacy fallbacks.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} 'unsafe-inline' https://www.googletagmanager.com https://www.clarity.ms`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://www.google-analytics.com",
    "font-src 'self'",
    "connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io https://*.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://c.bing.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function generateNonce(): string {
  // Edge runtime: Web Crypto API only (no Node.js Buffer).
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function middleware(request: NextRequest): NextResponse {
  const nonce = generateNonce();
  const csp = buildCsp(nonce);

  // Forward the nonce to Server Components via a request header.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  // Also set CSP on the request headers so nested layouts can read it if needed.
  requestHeaders.set("content-security-policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

// Apply to all page routes. Skip:
//   _next/static  — pre-built JS/CSS bundles (no HTML, no inline scripts)
//   _next/image   — image optimisation responses
//   favicon.ico   — icon file
// API routes (/api/*) receive the header too — harmless on JSON responses,
// and the nonce is needed for /api/ask's streaming HTML shell on some paths.
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
