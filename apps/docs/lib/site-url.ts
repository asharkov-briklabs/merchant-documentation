/**
 * Single source of truth for the canonical site origin.
 *
 * Previously each consumer (layout metadataBase, robots, sitemap, homepage
 * JSON-LD) read `NEXT_PUBLIC_SITE_URL` inline with its own fallback — and they
 * disagreed (`http://localhost:3000` in three places, `https://docs.vinr.com`
 * in one). If the env var is ever unset in production, canonical links, OG
 * tags, and the sitemap silently point at localhost, quietly wrecking SEO.
 *
 * This module centralizes the resolution and FAILS FAST on the real production
 * deploy: a Vercel production build with no `NEXT_PUBLIC_SITE_URL` throws here
 * rather than shipping localhost URLs. Local builds and CI (which sets a dummy
 * value) are unaffected — they fall back to the canonical production host.
 */

const RAW = process.env.NEXT_PUBLIC_SITE_URL;

// Only the genuine Vercel production deploy is gated. Local `next build`
// (NODE_ENV=production but VERCEL_ENV unset) and previews fall back cleanly,
// so this never breaks dev/CI builds.
if (!RAW && process.env.VERCEL_ENV === "production") {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required in production — canonical URLs, OpenGraph tags, " +
      "and the sitemap all derive from it. Set it in the Vercel project settings."
  );
}

/** Canonical site URL, no trailing slash. */
export const SITE_URL = (RAW || "https://docs.vinr.com").replace(/\/$/, "");

/** Canonical origin (scheme + host), used for same-origin request checks. */
export const SITE_ORIGIN = new URL(SITE_URL).origin;
