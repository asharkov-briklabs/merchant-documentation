// Sentry browser SDK init. Loaded automatically by the Sentry webpack plugin.
// No-ops when NEXT_PUBLIC_SENTRY_DSN is unset (dev/CI), so it stays quiet there.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  tracesSampleRate: 0.1,
  // Only record session replays on error to keep volume (and cost) low.
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
});
