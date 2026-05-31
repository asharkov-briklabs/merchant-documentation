import { createMDX } from "fumadocs-mdx/next";
import { withSentryConfig } from "@sentry/nextjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const withMDX = createMDX();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Content Security Policy. Pragmatic baseline — not yet nonce-based:
//  - `'unsafe-inline'` is required for scripts because Next.js emits inline
//    hydration/bootstrap scripts and the homepage renders an inline JSON-LD
//    <script>. Upgrading to a nonce-based script-src needs middleware changes,
//    and middleware.ts is Edge-bundle-sensitive (see its comment) — tracked as
//    a follow-up.
//  - `'unsafe-inline'` for styles covers Fumadocs/Tailwind/next-font inline
//    style injection.
//  - Sentry ingest is allowed in connect-src; everything else is same-origin.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://*.sentry.io https://*.ingest.sentry.io",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,

  // NOTE: `output: "standalone"` is intentionally NOT used. The fumadocs i18n
  // middleware (default-locale hiding) redirect-loops the root URL under the
  // standalone `node server.js` server. The app is run with `next start`
  // instead (see Dockerfile / DEPLOYMENT.md) — equally platform-agnostic, no
  // Vercel coupling, and behaves identically to production.

  experimental: {
    // Enables instrumentation.ts (Sentry server/edge init) — stable in Next 15,
    // still flagged in 14.x.
    instrumentationHook: true,
    // The Ask-AI retrieval index reads the raw .mdx files from disk at request
    // time (lib/docs-retrieval.ts). Those paths are computed dynamically, so
    // Vercel's serverless file-tracing won't bundle `content/` into the
    // function on its own — without this the assistant silently loses its
    // grounding in production. `outputFileTracingRoot` points tracing at the
    // pnpm monorepo root so the relative include resolves correctly.
    outputFileTracingRoot: join(__dirname, "../.."),
    outputFileTracingIncludes: {
      "/api/ask": ["./content/**/*"],
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

// The `dev` script runs plain `next dev` (no --turbo), so Turbopack is already
// off; no config surgery needed. If Turbopack is ever desired, validate it
// against fumadocs-ui's client components first.
//
// withSentryConfig wraps the build to upload source maps and auto-instrument
// server functions. Source-map upload only happens when SENTRY_AUTH_TOKEN +
// org/project are set, so local/CI builds without them are unaffected.
export default withSentryConfig(withMDX(config), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
});
