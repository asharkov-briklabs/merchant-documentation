import { createMDX } from "fumadocs-mdx/next";
import { withSentryConfig } from "@sentry/nextjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const withMDX = createMDX();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Content Security Policy. Pragmatic baseline — not yet nonce-based:
//  - `'unsafe-inline'` is required for scripts because Next.js emits inline
//    hydration/bootstrap scripts and the homepage renders an inline JSON-LD
//    <script>. Upgrading to nonce-based script-src is a tracked follow-up.
//  - `'unsafe-inline'` for styles covers Fumadocs/Tailwind/next-font inline
//    style injection.
//  - Sentry ingest is allowed in connect-src; everything else is same-origin.
// webpack dev mode uses eval() for source maps; allow it in development only.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
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

  // NOTE: `output: "standalone"` is intentionally NOT used. The app is run
  // with `next start` (see Dockerfile / DEPLOYMENT.md) — equally
  // platform-agnostic, no Vercel coupling, and behaves identically to production.

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
      // The /api/md/* raw-Markdown endpoint reads .mdx from disk too.
      "/api/md/[[...slug]]": ["./content/**/*"],
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  async redirects() {
    // The API reference moved out of the docs tree onto its own dedicated
    // screen at /api-reference (the docs.stripe.com/api equivalent — the literal
    // /api path is reserved for route handlers like /api/ask). Keep the old
    // /docs/api-reference URLs (inbound links / SEO) working.
    return [
      { source: "/docs/api-reference", destination: "/api-reference", permanent: false },
      { source: "/docs/api-reference/:path*", destination: "/api-reference/:path*", permanent: false },
    ];
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
