// This file runs in the Vercel Edge runtime, which has no Node.js globals
// (`__dirname`, `require`, fs, etc.). Keep its import graph Edge-safe:
// `@/lib/i18n` is intentionally a plain config object with no Node imports,
// and `fumadocs-core` is pinned (see package.json) because an unpinned
// minor bump previously dragged a `__dirname` reference into this bundle and
// crashed the deployed Edge function. `fumadocs-core/i18n` and
// `fumadocs-core/middleware` re-export the same `createI18nMiddleware`.
import { createI18nMiddleware } from "fumadocs-core/i18n";
import { i18n } from "@/lib/i18n";

export default createI18nMiddleware(i18n);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.png|api/).*)"],
};
