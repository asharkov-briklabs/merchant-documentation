/**
 * Single source of truth for the canonical site origin.
 *
 * Previously each consumer (layout metadataBase, robots, sitemap, homepage
 * JSON-LD) read `NEXT_PUBLIC_SITE_URL` inline with its own fallback — and they
 * disagreed (`http://localhost:3000` in three places, `https://docs.vinr.com`
 * in one). If the env var is ever unset in production, canonical links, OG
 * tags, and the sitemap silently point at localhost, quietly wrecking SEO.
 *
 * This module centralizes the resolution and FAILS FAST on a real production
 * deploy: a production build/runtime with no `NEXT_PUBLIC_SITE_URL` throws here
 * rather than shipping localhost URLs. The gate is platform-agnostic — it fires
 * on Vercel, Docker, bare Node, or any host. Local `next build` and CI opt out
 * with `ALLOW_DEFAULT_SITE_URL=true` (or by passing a real value).
 */

const RAW = process.env.NEXT_PUBLIC_SITE_URL;

// A "real production deploy" is any production build/runtime that hasn't
// explicitly opted into the default. NODE_ENV is set to "production" by
// `next build`/`next start` on every platform, so this no longer depends on
// Vercel-specific env vars. Local builds and CI set ALLOW_DEFAULT_SITE_URL so
// they fall back to the canonical host without tripping the guard.
const isProduction = process.env.NODE_ENV === "production";
const allowDefault =
  process.env.ALLOW_DEFAULT_SITE_URL === "true" || process.env.CI === "true";

if (!RAW && isProduction && !allowDefault) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required in production — canonical URLs, OpenGraph tags, " +
      "and the sitemap all derive from it. Set it in your deploy environment " +
      "(or set ALLOW_DEFAULT_SITE_URL=true to fall back to the canonical host)."
  );
}

/** Canonical site URL, no trailing slash. */
export const SITE_URL = (RAW || "https://docs.vinr.com").replace(/\/$/, "");

/** Canonical origin (scheme + host), used for same-origin request checks. */
export const SITE_ORIGIN = new URL(SITE_URL).origin;
