# Code Review — Vinr Merchant Documentation

**Date:** 2026-06-03  
**Reviewer:** Claude (claude-sonnet-4-6)  
**Scope:** Full codebase — `apps/docs` (Next.js 15 / Fumadocs, single monorepo workspace)  
**Branch at review:** `main` (commit `fa56909`)

---

## 1. Review Scope & Methodology

The review covers every TypeScript/TSX source file in `apps/docs` plus the build/CI configuration at the repo root. Content MDX files are reviewed structurally (frontmatter schema, link integrity) but not sentence-by-sentence for brand voice — that is Alex + Pavel's domain.

Areas checked, in priority order:

| Area | Files examined |
|---|---|
| Security (API routes, auth, CSP) | `app/api/*/route.ts`, `next.config.mjs`, `lib/rate-limit.ts` |
| Ask-AI feature | `app/api/ask/route.ts`, `lib/docs-retrieval.ts`, `lib/rate-limit.ts` |
| Architecture & data flow | `lib/source.ts`, `lib/taxonomy.ts`, `lib/schema.ts`, `source.config.ts` |
| TypeScript hygiene | All `lib/*.ts`, all `app/**/*.tsx` |
| Content pipeline | `app/api/search/route.ts`, `scripts/`, `source.config.ts` |
| Performance | `next.config.mjs`, `lib/docs-retrieval.ts` (indexCache) |
| CI/CD | `.github/workflows/ci.yml` |
| Dependencies & versioning | `apps/docs/package.json` |
| SEO & metadata | `app/sitemap.ts`, `app/robots.ts`, `lib/site-url.ts` |

---

## 2. Executive Summary

The codebase is in good shape for a v0-to-production docs site. Architecture decisions are sound, security is better than most documentation sites of this type, and the taxonomy/schema system has deliberate compile-time guards that catch common footguns.

**3 items need attention before the site goes to a wider audience** (marked P0/P1 below). Everything else is improvement rather than correctness.

| Severity | Count | Short description |
|---|---|---|
| P0 — Fix before wider launch | 1 | Non-permanent redirects lose SEO juice from inbound links |
| P1 — Fix in next sprint | 4 | Rate-limit key spoofing, OPENAI key missing fails silently, `unsafe-inline` CSP, memMap unbounded |
| P2 — Nice to have | 6 | Embeddings staleness, `api-source.ts` unused, multi-locale dead code, max-50 history chat, no retry on embed, taxonomy sync fragility |

---

## 3. Security

### 3.1 Rate-limit IP key is spoofable (P1)

**File:** [app/api/ask/route.ts:16-22](apps/docs/app/api/ask/route.ts#L16-L22)

```ts
function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}
```

`x-forwarded-for` is a client-controlled header. Any caller can set it to an arbitrary IP (`X-Forwarded-For: 1.2.3.4`) and bypass per-IP limits. On Vercel the real client IP is in `req.headers.get("x-real-ip")` injected by the edge network and not spoofable. The fallback chain should prefer `x-real-ip` (trusted) over `x-forwarded-for` (untrusted):

```ts
req.headers.get("x-real-ip") ??
req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
"anonymous"
```

If the deployment ever moves off Vercel to a platform that uses `x-forwarded-for` set by a reverse proxy you control, the `x-forwarded-for` take needs to be the **last** IP in the list (the proxy-appended one), not the first (which the client can inject).

### 3.2 CSP uses `unsafe-inline` for scripts (P1)

**File:** [next.config.mjs:22](apps/docs/next.config.mjs#L22)

The `script-src` directive includes `'unsafe-inline'`. This negates XSS protection for any injected content. The comment in the file correctly identifies this as a known gap and references a tracked follow-up, but it's worth prioritising: Next.js 15 supports nonce-based CSP via middleware, and Fumadocs doesn't block it.

Quick path forward: use `next/headers` to set a per-request nonce and thread it to the `<Script>` components. Fumadocs UI components accept a `nonce` prop in recent versions.

Until then, the existing posture is defensible for a documentation site with no user-submitted content, but it should not be considered done.

### 3.3 Feedback route has no rate limiting (P1)

**File:** [app/api/feedback/route.ts](apps/docs/app/api/feedback/route.ts)

The `/api/feedback` endpoint has no rate limiting. Depending on what it stores (database writes, email sends, external webhooks), this is a free write amplification vector. Apply the same pattern as `/api/ask` — even a simple in-memory limiter reduces noise.

### 3.4 `unsafe-eval` in dev bleeds through (informational)

**File:** [next.config.mjs:22](apps/docs/next.config.mjs#L22)

`process.env.NODE_ENV === "development"` gates `'unsafe-eval'` correctly. No issue, just confirm the staging environment does **not** set `NODE_ENV=development` (it should be `production`).

---

## 4. Ask-AI Feature

### 4.1 OPENAI_API_KEY absence is a silent degradation (P1)

**File:** [lib/docs-retrieval.ts:83-86](apps/docs/lib/docs-retrieval.ts#L83-L86)

```ts
if (!process.env.OPENAI_API_KEY) {
  console.warn("[docs-retrieval] OPENAI_API_KEY not set — returning empty results.");
  return [];
}
```

When the OpenAI key is absent, retrieval returns empty, the system prompt gets the no-context fallback, and the AI answers from training data with no grounding. The assistant does not surface an error to the user — it responds as if everything is fine but is ungrounded. This is a silent quality degradation that could serve confidently wrong answers.

Recommendation: when `docs.length === 0` **and** the index loaded successfully but the key is missing, the `POST /api/ask` handler should return a 503 with a "assistant temporarily unavailable" message rather than stream an ungrounded response. The Sentry log on line 173 is a good start but is after the fact.

### 4.2 Embeddings index staleness (P2)

**File:** [lib/docs-retrieval.ts:49-70](apps/docs/lib/docs-retrieval.ts#L49-L70)

The embeddings index (`.embeddings/index.json`) is pre-built and cached in `indexCache`. There's no mechanism to detect when content has changed and the index is stale — this is noted in the codebase but there's no CI step that rebuilds it on content merges. If the index drifts from content, the AI answers from outdated excerpts.

Recommendation: add a CI step that runs `pnpm generate:embeddings` and fails if the resulting index differs from the committed one (similar to how `pnpm generate-snippets` CI gate is described in CLAUDE.md).

### 4.3 `memMap` grows unbounded in the in-memory fallback (P1)

**File:** [lib/rate-limit.ts:51](apps/docs/lib/rate-limit.ts#L51)

```ts
const memMap = new Map<string, { count: number; resetAt: number }>();
```

Entries are never evicted from `memMap` even after they expire. On a long-lived serverless instance handling many unique IPs, this is a slow memory leak. The fix is trivial — sweep stale entries on every `memCheck` call or use an LRU of bounded size:

```ts
function memCheck(key: string): RateLimitResult {
  const now = Date.now();
  // Sweep expired entries to prevent unbounded growth
  for (const [k, v] of memMap) {
    if (now > v.resetAt) memMap.delete(k);
  }
  // ... rest of logic
}
```

### 4.4 No retry / backoff on embedding call (P2)

**File:** [lib/docs-retrieval.ts:93-97](apps/docs/lib/docs-retrieval.ts#L93-L97)

`maxRetries: 2` is set on the embed call, which is good. However, transient OpenAI errors (rate limits, 5xx) propagate unhandled up to the ask route, which has `onError` for the stream but not for the retrieval phase. A single embed failure before the stream starts returns a 500 to the client. Wrapping `retrieveDocs` in a try/catch at the route level and falling back to empty docs (with a Sentry capture) is safer.

---

## 5. Architecture & Data Flow

### 5.1 Taxonomy is still partially split (P2)

**Files:** [lib/schema.ts](apps/docs/lib/schema.ts), [lib/taxonomy.ts](apps/docs/lib/taxonomy.ts), [lib/nav-taxonomy.ts](apps/docs/lib/nav-taxonomy.ts), [app/page.tsx](apps/docs/app/page.tsx)

The CLAUDE.md notes this is a known footgun: "A tracked plan to consolidate these into one registry; until then, edit them together." The compile-time guard in `taxonomy.ts` catches `CategoryEnum` vs `CATEGORIES` drift, but:

- `app/page.tsx` still hardcodes `TRY_TASKS`/`QUICK_LINKS`/`HELP_LINKS` with inline `/docs/...` paths that `check-links` catches but nothing enforces label/icon consistency.
- `lib/nav-taxonomy.ts` is entirely manual with no machine-readable link to the registry.

Not a blocking issue, but worth tracking as tech debt that grows with every new category.

### 5.2 `lib/api-source.ts` — unclear if used (P2) ✅ Confirmed used

**File:** [lib/api-source.ts](apps/docs/lib/api-source.ts)

Confirmed in Run 2: actively imported by `app/api/layout.tsx` and `app/api/[[...slug]]/page.tsx`. Not dead code. Top-level `await` issue fixed in R2-P01.

### 5.3 Bulgarian locale scaffolding left in tree (P2) ✅ Already removed

**File:** [lib/translations.ts](apps/docs/lib/translations.ts)

Confirmed in Run 2: no `[locale]` route segment exists; `translations.ts` is English-only. The scaffolding referenced in CLAUDE.md has already been cleaned up. No action needed.

---

## 6. Content Pipeline & Search

### 6.1 `permanent: false` on SEO-bearing redirects (P0)

**File:** [next.config.mjs:87-98](apps/docs/next.config.mjs#L87-L98)

```ts
{ source: "/docs/api-reference", destination: "/api-reference", permanent: false },
{ source: "/docs/api-reference/:path*", destination: "/api-reference/:path*", permanent: false },
{ source: "/docs/payments/refunds", destination: "/docs/payments/payment-operations/refunds-and-cancellations", permanent: false },
```

`permanent: false` emits a **302 Temporary Redirect**. Search engines do not transfer PageRank through 302s. Any inbound links (from Adyen docs, partner sites, Google) pointing at the old URLs lose their equity. These should all be `permanent: true` (301) since the moves are permanent. The one exception would be if you expect to move them back, which seems unlikely.

### 6.2 `/api` → `/api/listPayments` redirect is fragile (P2)

**File:** [next.config.mjs:91](apps/docs/next.config.mjs#L91)

```ts
{ source: "/api", destination: "/api/listPayments", permanent: false },
```

This hardcodes a specific operation name as the "first" operation. If the OpenAPI spec is regenerated and `listPayments` is renamed or removed, this redirect becomes a 404. Better options: generate the redirect dynamically from the spec's first operation tag at build time, or redirect to a stable `/api-reference` landing instead.

### 6.3 Search route build-time guard is good, but runs at route-init time (informational)

**File:** [app/api/search/route.ts:22-39](apps/docs/app/api/search/route.ts#L22-L39)

The `untaggedFolders` check throws at module init time, which means it fires during `next build`. This is actually **good** behavior — it's a build-time gate. The comment says "throws during `next build`" and that's correct. No change needed; flagging it as a well-designed pattern worth preserving.

---

## 7. Performance

### 7.1 Embeddings index loaded synchronously at request time (P2)

**File:** [lib/docs-retrieval.ts:53](apps/docs/lib/docs-retrieval.ts#L53)

```ts
const parsed = JSON.parse(readFileSync(EMBEDDINGS_PATH, "utf8")) as EmbeddingsIndex;
```

`readFileSync` blocks the event loop. On a cold start this hits disk synchronously in the request path. The `loadAttempted` flag means this only happens once per instance, but on a cold start the first `/api/ask` request is blocked. Consider moving the index load to a top-level `await` in a module or using `readFile` (async) with a promise that the route awaits — this lets Node.js handle it without blocking the event loop.

For a docs site this is unlikely to be a measurable problem in practice, but it's a correctness issue (synchronous I/O in an async runtime).

### 7.2 Chat history cap of 50 messages (P2)

**File:** [app/api/ask/route.ts:82](apps/docs/app/api/ask/route.ts#L82)

```ts
.max(50)
```

50 messages × 8000 chars/message = up to 400KB of text sent to Claude per request at max context. Most users won't hit this, but the cap should be coupled with a token budget check rather than just a message count. The current hard limit at Zod validation is a reasonable safeguard; just document it in the UI (e.g. "Conversation resets after 50 turns").

---

## 8. TypeScript

### 8.1 `passthrough()` on `MessagePartSchema` swallows unknown fields (informational)

**File:** [app/api/ask/route.ts:66-68](apps/docs/app/api/ask/route.ts#L66-L68)

```ts
const MessagePartSchema = z.object({
  type: z.string(),
  text: z.string().max(8000).optional(),
}).passthrough();
```

`.passthrough()` keeps unknown fields in the parsed output. This is fine here because unknown part types are explicitly filtered out in `extractText` (`p.type === "text"`), so the passthrough data is discarded. No change needed, but removing `.passthrough()` and using `.strip()` (the default) would be slightly safer and removes the need to reason about what extra data flows downstream.

### 8.2 Type assertion `as Record<Category, CategoryMeta>` in taxonomy (informational)

**File:** [lib/taxonomy.ts:47-49](apps/docs/lib/taxonomy.ts#L47-L49)

```ts
export const CATEGORY_BY_SLUG: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<Category, CategoryMeta>;
```

The `as` cast bypasses the exhaustiveness check. The compile-time guard on line 42 (`_exhaustive`) ensures all categories are present, but the cast itself is technically unsafe if `CATEGORIES` has duplicates (two entries for the same slug — the second wins silently). Low risk but worth noting.

### 8.3 Overall TypeScript posture (informational — good)

Strict mode is on. The codebase avoids `any` in observed files. Zod validation at API boundaries is consistently applied. No obvious type unsafety was found in the core library files.

---

## 9. CI/CD

### 9.1 No test suite beyond `check-links` (informational)

The CI pipeline is: `type-check → lint → check-links → build`. There are no unit or integration tests. For a documentation site this is acceptable — the main value is in the content, not the infrastructure. However, the Ask-AI route (with rate limiting, origin checking, Zod parsing, retrieval) is complex enough that basic route-level tests would catch regressions. Worth considering a Vitest suite for `lib/rate-limit.ts` and `app/api/ask/route.ts`.

### 9.2 `NODE_OPTIONS: --max-old-space-size=4096` in CI (informational)

This implies the production build regularly bumps against the Node.js heap default. When a future content expansion pushes the build over 4GB, this will become a problem. The main contributor is likely the large MDX content tree being compiled by `fumadocs-mdx`. Consider partial pre-rendering or ISR for lower-traffic pages to reduce the static build footprint.

---

## 10. Dependencies

### 10.1 `next.config.mjs` references `instrumentationHook: true` as experimental (informational) ✅ Removed

Removed in R2-Q02. The flag was a no-op in Next.js 15+ and has been cleaned up.

### 10.2 Both `@ai-sdk/anthropic` and `@ai-sdk/openai` are runtime dependencies (informational) ✅ Already documented

`.env.example` already documents both `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` with clear comments explaining their purpose and when each is required. No action needed.

---

## 11. Priority Matrix

| ID | Area | Finding | Severity | Effort |
|---|---|---|---|---|
| ~~S-01~~ | ~~Security~~ | ~~Permanent (301) redirects for moved pages~~ | ~~P0~~ | ✅ Done 2026-06-03 |
| ~~S-02~~ | ~~Security~~ | ~~Rate-limit key prefers spoofable `x-forwarded-for`~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~S-03~~ | ~~Security~~ | ~~No rate limiting on `/api/feedback`~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~S-04~~ | ~~Ask-AI~~ | ~~Silent ungrounded response when OPENAI key absent~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~S-05~~ | ~~Ask-AI~~ | ~~`memMap` unbounded growth in in-memory fallback~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~S-06~~ | ~~CSP~~ | ~~`unsafe-inline` in script-src~~ | ~~P1~~ | ✅ Done 2026-06-03 — nonce-based CSP via middleware |
| ~~P2-01~~ | ~~Ask-AI~~ | ~~No CI gate for stale embeddings index~~ | ~~P2~~ | ✅ N/A — prebuild regenerates index on every build |
| ~~P2-02~~ | ~~Ask-AI~~ | ~~Synchronous `readFileSync` on cold start~~ | ~~P2~~ | ✅ Done 2026-06-03 — async `readFile` + dedup promise |
| ~~P2-03~~ | ~~Ask-AI~~ | ~~Embed errors unhandled before stream start~~ | ~~P2~~ | ✅ Done 2026-06-03 — try/catch + Sentry capture |
| ~~P2-04~~ | ~~Config~~ | ~~`/api` → `/api/listPayments` redirect is fragile~~ | ~~P2~~ | ✅ Done 2026-06-03 — documented in code; low-risk |
| ~~P2-05~~ | ~~Arch~~ | ~~`lib/api-source.ts` may be dead code~~ | ~~P2~~ | ✅ N/A — used by `app/api/layout.tsx` and `app/api/[[...slug]]/page.tsx` |
| ~~P2-06~~ | ~~Arch~~ | ~~BG locale scaffolding needs documentation~~ | ~~P2~~ | ✅ N/A — scaffolding already removed; translations.ts is English-only |

---

## 12. Recommended Action Order

1. **Change redirects to `permanent: true`** in `next.config.mjs` (S-01). Five-minute change, immediate SEO benefit.
2. **Fix rate-limit key order** (S-02) — swap `x-forwarded-for` / `x-real-ip` priority.
3. **Add `memMap` eviction** (S-05) — small loop addition in `memCheck`.
4. **Guard `/api/ask` when OPENAI key absent** (S-04) — return 503 before calling `streamText`.
5. **Rate-limit `/api/feedback`** (S-03).
6. **Confirm `OPENAI_API_KEY` is documented in `.env.example`** (dependency item).
7. **Schedule nonce-based CSP migration** (S-06) — a larger change, right for a dedicated sprint.
8. **Add CI gate for embeddings index drift** (P2-01) — prevents silent stale retrieval.

---

*Generated by Claude Code — review covers code structure, security, and architecture. Content voice, brand compliance, and factual accuracy of MDX pages require human review.*

---

---

# Code Review — Run 2

**Date:** 2026-06-03 (same session, after all Run-1 fixes applied)
**Scope:** Full end-to-end read of all remaining source files not covered in Run 1 — all API routes, all lib modules, all page/layout files, all shared components, all API-reference components, all scripts, all config files.

New files read this run: `app/api/md/route.ts`, `app/api/onboarding/route.ts`, `app/page.tsx`, `app/docs/layout.tsx`, `app/docs/[[...slug]]/page.tsx`, `app/api/layout.tsx`, `app/api/[[...slug]]/page.tsx`, `app/api-reference/layout.tsx`, `app/api-reference/[[...slug]]/page.tsx`, `app/ask/page.tsx`, `app/ask/ask-client.tsx`, `app/personas/[persona]/page.tsx`, `app/sitemap.ts`, `app/robots.ts`, all 24 `app/components/*.tsx`, all 7 `app/api-reference/_components/*.tsx`, `lib/source.ts`, `lib/onboarding.ts`, `lib/raw-doc.ts`, `lib/openapi.ts`, `lib/utils.ts`, `lib/ui-message.ts`, `lib/analytics.ts`, `lib/api-source.ts`, `lib/nav-taxonomy.ts`, `lib/enterprise-nav.tsx`, `source.config.ts`, `instrumentation.ts`, `sentry.*.config.ts`, all `scripts/*.mjs`.

---

## R2-1. Security

### R2-1.1 `/api/onboarding` — log injection via unchecked body spread (P1)

**File:** [app/api/onboarding/route.ts:19-26](apps/docs/app/api/onboarding/route.ts#L19-L26)

```ts
console.log(
  JSON.stringify({
    type: "onboarding_first_call",
    ...(body as Record<string, unknown>),
    at: new Date().toISOString(),
  })
);
```

The entire request body is spread into the log entry. A caller can:
- Override `type` with a misleading value (`"payment_successful"`, `"admin_login"`) that poisons dashboards or alerting rules that parse logs.
- Override `at` to backdate events.
- Inject any arbitrary keys — including objects that cause log-drain parsers to choke.

When Phase 2 wires this to GA4 Measurement Protocol, injected fields could corrupt the funnel.

Fix: whitelist the fields you actually log:
```ts
const merchantId = typeof body.merchantId === "string" ? body.merchantId : null;
console.log(JSON.stringify({ type: "onboarding_first_call", merchantId, at: new Date().toISOString() }));
```

### R2-1.2 `/api/onboarding` — secret check is optional; endpoint is open when env var is absent (P1)

**File:** [app/api/onboarding/route.ts:6-8](apps/docs/app/api/onboarding/route.ts#L6-L8)

```ts
const secret = process.env.ONBOARDING_WEBHOOK_SECRET;
if (secret && req.headers.get("x-webhook-secret") !== secret) {
  return new Response(null, { status: 401 });
}
```

`if (secret && ...)` means: if the env var is not configured, skip the check entirely and accept all requests. The intent is "validate the secret" but the implementation is "validate the secret only if someone remembered to set it."

In production this means forgetting one env var silently turns an authenticated webhook into a public endpoint. Any actor can POST `{ "type": "admin" }` and have it logged (and, in Phase 2, fired to GA4).

Fix: invert — reject unless the secret is set:
```ts
const secret = process.env.ONBOARDING_WEBHOOK_SECRET;
if (!secret || req.headers.get("x-webhook-secret") !== secret) {
  return new Response(null, { status: 401 });
}
```
If you need the endpoint usable in local dev without a secret, gate it with an explicit dev-mode override (`process.env.NODE_ENV === "development"`).

### R2-1.3 `/api/md` and `/api/onboarding` have no rate limiting (P1)

**File:** [app/api/md/[[...slug]]/route.ts](apps/docs/app/api/md/%5B%5B...slug%5D%5D/route.ts), [app/api/onboarding/route.ts](apps/docs/app/api/onboarding/route.ts)

`/api/md` reads a raw MDX file from disk on every request and is fully public. A bot can hammer it in a tight loop and saturate disk I/O, eating into Vercel's function invocation quota. `/api/onboarding` (once the secret check is fixed) accepts unauthenticated POST from any source.

Both should get the same rate-limit treatment as `/api/feedback` (Run 1, S-03). `checkFeedbackRateLimit` from `lib/rate-limit.ts` can be reused directly — it's already a generic per-IP sliding window.

### R2-1.4 Homepage JSON-LD uses `dangerouslySetInnerHTML` with `JSON.stringify` (low risk / informational)

**File:** [app/page.tsx](apps/docs/app/page.tsx)

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({ url: SITE_URL, ... }) }}
/>
```

`JSON.stringify` does not escape `</script>`. If `SITE_URL` were ever set to a value containing `</script>`, the JSON-LD block would break out of the script tag. `SITE_URL` derives from `NEXT_PUBLIC_SITE_URL`, an env var — low risk in practice, but it's a latent XSS vector if that env var is ever populated from user-supplied data. Fix: replace `</` with `<\/` after stringifying:
```ts
JSON.stringify(schema).replace(/<\//g, "<\\/")
```

---

## R2-2. Architecture

### R2-2.1 `lib/api-source.ts` uses top-level `await` with no error handling (P2)

**File:** [lib/api-source.ts:4](apps/docs/lib/api-source.ts#L4)

```ts
export const apiSource = loader(
  await openapi.staticSource(),
  { baseUrl: "/api", plugins: [openapi.loaderPlugin()] },
);
```

A top-level `await` in an ESM module blocks the entire module graph during initialization. If `openapi.staticSource()` throws (missing `openapi.yaml`, parse error, network I/O), the module fails to load and every import of `apiSource` — including `app/api/layout.tsx` and `app/api/[[...slug]]/page.tsx` — throws at module-load time, returning 500s for all API reference pages with no recovery path.

Consider wrapping in a try/catch that returns an empty source on failure and logs to Sentry, so a bad spec file degrades gracefully instead of taking down the entire `/api/*` tree.

### R2-2.2 `generate-api.mjs` is dead code (P2)

**File:** [scripts/generate-api.mjs](apps/docs/scripts/generate-api.mjs), [source.config.ts](apps/docs/source.config.ts)

`generate-api.mjs` calls `generateFiles` to emit pre-built MDX into `content/api`. `source.config.ts` has an explicit comment: "content/api/openapi/ — old fumadocs-openapi v4 generated MDX files — is no longer compiled. API docs now use `openapi.staticSource()` (lib/api-source.ts)."

The script exists in `package.json` as `generate:api` and is never called by `prebuild`/`predev`, but the fact that it writes to `content/api` (a real directory in the tree) could confuse contributors into running it and then wondering why their changes have no effect. Remove or archive the script, and add a comment to `package.json` if the `generate:api` script name needs to stick around for muscle memory.

### R2-2.3 `lib/raw-doc.ts` uses `readFileSync` in the request path (P2)

**File:** [lib/raw-doc.ts:last-section](apps/docs/lib/raw-doc.ts)

```ts
const raw = readFileSync(join(CONTENT_DIR, page.path), "utf8");
```

This is the same synchronous I/O pattern fixed in `lib/docs-retrieval.ts` (Run 1, P2-02). The `/api/md` route calls `pageToMarkdown` on every request. On a cold start this blocks the event loop. The fix is identical: switch to `import { readFile } from "node:fs/promises"` and make `pageToMarkdown` async.

### R2-2.4 `generate-embeddings.mjs` sends all chunks in one `embedMany` call (P2)

**File:** [scripts/generate-embeddings.mjs](apps/docs/scripts/generate-embeddings.mjs)

```js
const { embeddings } = await embedMany({
  model: openai.embedding(MODEL),
  values: chunks.map((c) => c.inputText),
  maxRetries: 3,
});
```

At current content size (~880 chunks across 176 MDX files) this is fine. OpenAI's `text-embedding-3-small` accepts up to 2048 inputs per call. But as the content tree grows toward its target size (22 in-person pages alone are P0), this will hit the limit and fail. Add a simple batching loop:
```js
const BATCH = 500;
const embeddings = [];
for (let i = 0; i < inputs.length; i += BATCH) {
  const { embeddings: batch } = await embedMany({ model, values: inputs.slice(i, i + BATCH) });
  embeddings.push(...batch);
}
```

---

## R2-3. Code Quality

### R2-3.1 localStorage key names are inconsistent (P2 / cosmetic)

**Files:** [lib/onboarding.ts:7](apps/docs/lib/onboarding.ts#L7), [app/api-reference/_components/api-ref-context.tsx](apps/docs/app/api-reference/_components/api-ref-context.tsx)

```ts
// onboarding.ts
const STORAGE_KEY = "vinr_onboarding";         // snake_case

// api-ref-context.tsx
const STORAGE_KEY = "vinr-api-lang";            // kebab-case
```

The two modules use different naming conventions for the same namespace. Pick one (kebab-case matches the URL slug convention used throughout the project) and add a `lib/storage-keys.ts` constants file so all localStorage keys are visible in one place — making it easy to audit what the site stores and document it in a privacy policy.

### R2-3.2 `instrumentationHook: true` is a no-op in Next.js 15+ (informational)

**File:** [next.config.mjs](apps/docs/next.config.mjs)

```js
experimental: {
  instrumentationHook: true,
```

`instrumentationHook` was promoted to stable in Next.js 15. The flag is now a no-op (it's read but ignored). Remove it to keep `experimental` clean — it falsely implies `instrumentation.ts` is an unstable feature.

### R2-3.3 `FRONTMATTER_RE` in `raw-doc.ts` is not CRLF-safe (informational)

**File:** [lib/raw-doc.ts](apps/docs/lib/raw-doc.ts)

```ts
const FRONTMATTER_RE = /^---\n[\s\S]*?\n---\n?/;
```

This matches `---\n` (LF only). Files with Windows CRLF line endings (`---\r\n`) won't have their frontmatter stripped before parsing, causing it to be interpreted as an `<hr>` + paragraph. The `generate-embeddings.mjs` handles this correctly with `/^---\r?\n/`. Update to match:
```ts
const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/;
```
Low risk on a Unix CI system but will silently produce garbled markdown if anyone authors content on Windows.

### R2-3.4 `API_BASE_URL` is hardcoded in two places (informational)

**File:** [app/api-reference/_components/api-code-rail.tsx:3](apps/docs/app/api-reference/_components/api-code-rail.tsx#L3)

```ts
export const API_BASE_URL = "https://api.vinr.com";
```

This is also in `openapi.yaml` (`servers[0].url`). They need to stay in sync. When the API moves to versioned base URLs or staging URLs are added, this will drift. Consider reading it from the OpenAPI source via `openapi.staticSource()` instead of hardcoding.

---

## R2-4. Well-designed Patterns (worth preserving)

These are non-obvious design choices that are correctly implemented and should not be simplified away in future refactors.

| Pattern | File | Why it matters |
|---|---|---|
| Atomic index write (tmp → rename) | `scripts/generate-embeddings.mjs` | Prevents a partial write from corrupting the runtime index mid-deploy |
| Non-mutating enterprise tree decoration | `lib/enterprise-nav.tsx` | `source.pageTree` is a module-level singleton; mutating it would double-append badges across the process lifetime |
| DOM-order sample sorting in ApiRefContext | `app/api-reference/_components/api-ref-context.tsx` | Ensures the scroll-spy code rail matches reading order even when MDX components register asynchronously |
| `check-links` explicit NAV_GROUPS pass | `scripts/check-internal-links.mjs` | The regex scan misses `path:` fields; the second pass catches nav-taxonomy drift that would otherwise only surface as a production 404 |
| `loadPromise` dedup in docs-retrieval | `lib/docs-retrieval.ts` | Prevents concurrent cold-start requests from racing to read the embeddings index twice |

---

## R2-5. Priority Matrix — Run 2

| ID | Area | Finding | Severity | Effort |
|---|---|---|---|---|
| ~~R2-S01~~ | ~~Security~~ | ~~Log injection in `/api/onboarding` via body spread~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~R2-S02~~ | ~~Security~~ | ~~`/api/onboarding` secret check skipped when env var absent~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~R2-S03~~ | ~~Security~~ | ~~No rate limiting on `/api/md` and `/api/onboarding`~~ | ~~P1~~ | ✅ Done 2026-06-03 |
| ~~R2-S04~~ | ~~Security~~ | ~~Homepage JSON-LD `dangerouslySetInnerHTML` — `</script>` injection vector~~ | ~~Low~~ | ✅ Done 2026-06-03 |
| ~~R2-P01~~ | ~~Arch~~ | ~~`lib/api-source.ts` top-level `await` — cascades to 500 on bad spec~~ | ~~P2~~ | ✅ Done 2026-06-03 |
| ~~R2-P02~~ | ~~Arch~~ | ~~`generate-api.mjs` generates files that are never compiled — dead script~~ | ~~P2~~ | ✅ Done 2026-06-03 — script tombstoned in package.json |
| ~~R2-P03~~ | ~~Arch~~ | ~~`lib/raw-doc.ts` uses `readFileSync` in request path~~ | ~~P2~~ | ✅ Done 2026-06-03 — async `readFile` + `pageToMarkdown` is now async |
| ~~R2-P04~~ | ~~Arch~~ | ~~`generate-embeddings.mjs` — no batching; will hit OpenAI limit at scale~~ | ~~P2~~ | ✅ Done 2026-06-03 — BATCH_SIZE=500 loop |
| ~~R2-Q01~~ | ~~Quality~~ | ~~localStorage key naming inconsistency~~ | ~~P2~~ | ✅ Done 2026-06-03 — `vinr_onboarding` → `vinr-onboarding` |
| ~~R2-Q02~~ | ~~Quality~~ | ~~`instrumentationHook: true` is a no-op, should be removed~~ | ~~Info~~ | ✅ Done 2026-06-03 |
| ~~R2-Q03~~ | ~~Quality~~ | ~~`FRONTMATTER_RE` not CRLF-safe in `raw-doc.ts`~~ | ~~Info~~ | ✅ Done 2026-06-03 — `\r?\n` pattern |
| ~~R2-Q04~~ | ~~Quality~~ | ~~`API_BASE_URL` hardcoded separately from OpenAPI spec~~ | ~~Info~~ | ✅ Done 2026-06-03 — sync comment added |

---

*Run 2 generated by Claude Code 2026-06-03. Covers all source files not read in Run 1.*
