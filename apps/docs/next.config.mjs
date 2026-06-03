import { createMDX } from "fumadocs-mdx/next";
import { withSentryConfig } from "@sentry/nextjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const withMDX = createMDX();

const __dirname = dirname(fileURLToPath(import.meta.url));

// CSP is now generated per-request in proxy.ts with a cryptographic nonce,
// replacing the static 'unsafe-inline' baseline that was here. The remaining
// headers below are response-level and don't need to be per-request.
const securityHeaders = [
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

  // The Ask-AI retrieval index reads the raw .mdx files from disk at request
  // time (lib/docs-retrieval.ts). Those paths are computed dynamically, so
  // Vercel's serverless file-tracing won't bundle `content/` into the
  // function on its own — without this the assistant silently loses its
  // grounding in production. `outputFileTracingRoot` points tracing at the
  // pnpm monorepo root so the relative include resolves correctly.
  // (Promoted from `experimental` in Next.js 16.)
  outputFileTracingRoot: join(__dirname, "../.."),
  outputFileTracingIncludes: {
    // content/**/* covers the raw .mdx files (still needed for /api/md).
    // .embeddings/index.json is the pre-built vector index for Ask-AI.
    "/api/ask": ["./content/**/*", "./.embeddings/index.json"],
    // The /api/md/* raw-Markdown endpoint reads .mdx from disk too.
    "/api/md/[[...slug]]": ["./content/**/*"],
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
      { source: "/docs/api-reference", destination: "/api-reference", permanent: true },
      { source: "/docs/api-reference/:path*", destination: "/api-reference/:path*", permanent: true },
      // fumadocs-openapi generates no index page for /api, so redirect root to the
      // first operation. Keep permanent:false — if listPayments is ever renamed in
      // the OpenAPI spec, update this destination to match (and update all inbound
      // links at the same time, since the operation URL itself changes too).
      { source: "/api", destination: "/api/listPayments", permanent: false },
      // Payments restructure: flat pages moved into subfolders or renamed.
      { source: "/docs/payments/online-payments", destination: "/docs/payments/payment-page", permanent: true },
      { source: "/docs/payments/advanced-integrations", destination: "/docs/payments/elements", permanent: true },
      { source: "/docs/payments/advanced-integrations/:path*", destination: "/docs/payments/elements/:path*", permanent: true },
      { source: "/docs/payments/refunds", destination: "/docs/payments/payment-operations/refunds-and-cancellations", permanent: true },
      { source: "/docs/payments/disputes", destination: "/docs/payments/payment-operations/disputes", permanent: true },
      { source: "/docs/payments/fraud-prevention", destination: "/docs/payments/payment-operations/radar", permanent: true },
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
