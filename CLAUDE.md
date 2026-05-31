# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

VINR merchant documentation site — a public docs portal for the VINR payment platform (deployed at `docs.vinr.com`). It's a Next.js 14 (App Router) site built on **Fumadocs**, with MDX content under `apps/docs/content/docs`, plus an AI "Ask" assistant grounded in those docs.

It's a pnpm monorepo, but currently a single workspace package: `@vinr/docs` at `apps/docs`. Root scripts just `pnpm --filter @vinr/docs ...` through to it.

## Commands

Run from the repo root (they proxy to the docs package). Requires Node ≥18.17 and pnpm ≥9 (`packageManager` pins `pnpm@9.1.0`).

```bash
pnpm install              # --frozen-lockfile in CI
pnpm dev                  # next dev (no Turbopack — see next.config.mjs)
pnpm build                # next build
pnpm lint                 # next lint
pnpm type-check           # tsc --noEmit
pnpm check-links          # validate hand-maintained internal /docs links
```

CI (`.github/workflows/ci.yml`) runs, in order: `type-check` → `lint` → `check-links` → `build`. Match that locally before pushing.

`fumadocs-mdx` codegen (the `.source/` directory) regenerates automatically via `predev`/`prebuild`/`pretype-check` hooks (enabled by `enable-pre-post-scripts=true` in `.npmrc`). Run `pnpm --filter @vinr/docs generate` to force it. There is no test suite; `check-links` is the closest thing to one.

## Architecture

### Content pipeline (Fumadocs)
- MDX lives in `apps/docs/content/docs/<category>/*.mdx`. Top-level folders **are** the categories.
- `source.config.ts` defines the content collections and extends Fumadocs' base frontmatter with custom fields from `lib/schema.ts`.
- `lib/source.ts` is the `loader()` — the single accessor for pages/URLs/titles. Use `source.getPages()` rather than reading the content tree yourself, except where raw text is needed (see Ask-AI).
- Sidebar order/grouping comes from `content/docs/meta.json`.

### The taxonomy is split across several hand-maintained lists — keep them in sync
This is the main footgun. A doc's category, the nav, and the search facets are defined in different places:
- `lib/schema.ts` — `CategoryEnum` (must match the top-level `content/docs` folders) and `PersonaEnum`. A build-time assertion in `app/api/search/route.ts` throws if a content folder is missing from `CategoryEnum`.
- `lib/taxonomy.ts` — `CATEGORIES` registry (label/description/icon per category). Intended single source for the search facet and sidebar product switcher (`ROOTS` in `app/[locale]/docs/layout.tsx`).
- `lib/nav-taxonomy.ts` — `NAV_GROUPS`, the marketing mega-menu. Intentionally a *curated* view (hand-picked sub-links), **not** a projection of the registry.
- The homepage (`app/[locale]/page.tsx`) hardcodes link grids (`TRY_TASKS`/`QUICK_LINKS`/`HELP_LINKS`).

`pnpm check-links` (`scripts/check-internal-links.mjs`) scans `app/` and `lib/` for `/docs/...` string literals and asserts each resolves to a real `.mdx` page — this is what catches a renamed page silently 404-ing the nav/homepage. Run it after touching content paths or any of the lists above. There is a tracked plan to consolidate these into one registry; until then, edit them together.

### Frontmatter
Custom fields (all optional) defined in `lib/schema.ts`: `category` (overrides the folder default — only set to classify a doc outside its physical folder), `persona[]`, `priority` (P0/P1/P2, default P1), `lastUpdated`. Persona pages (`app/[locale]/personas/[persona]/page.tsx`) are driven by the `persona` frontmatter, not by a hardcoded list.

### i18n
`lib/i18n.ts` is currently **single-locale (`en`)**. The bilingual (`bg`) scaffolding (translations, per-link labels, `[locale]` route segment) is retained but Bulgarian was removed because there was no content (every `/bg/*` page 404'd). To re-enable: add the locale to `i18n.ts` and ship `*.bg.mdx` content together. `middleware.ts` runs the i18n middleware on the **Edge runtime** — keep its import graph Edge-safe (no Node globals); `fumadocs-core` is version-pinned for this reason.

### Ask-AI assistant
- `app/api/ask/route.ts` — `runtime = "nodejs"`, streams from Claude (`claude-haiku-4-5`) via the Vercel AI SDK (`@ai-sdk/anthropic`).
- `lib/docs-retrieval.ts` — dependency-free keyword-overlap retrieval over the raw `.mdx` files on disk (no vector DB; ~160 short docs). It reads source files because `source.getPages()` bodies are compiled React components, not text. This is why `next.config.mjs` sets `outputFileTracingIncludes` for `/api/ask` (and `outputFileTracingRoot` at the monorepo root) — otherwise Vercel won't bundle `content/` into the function and the assistant loses its grounding in production.
- `lib/rate-limit.ts` — abuse/cost protection: per-IP sliding window + a global daily cap, backed by Upstash Redis, with an in-memory per-instance fallback when Upstash env vars are absent (dev). The route also enforces a same-origin check.

### Config & infra you'll touch
- `lib/site-url.ts` — single source for the canonical origin. **Fails fast** on a Vercel *production* build if `NEXT_PUBLIC_SITE_URL` is unset (local/CI builds fall back to `https://docs.vinr.com`). Don't reintroduce inline `NEXT_PUBLIC_SITE_URL` reads elsewhere.
- `next.config.mjs` — security headers + a pragmatic (non-nonce) CSP using `'unsafe-inline'`; wraps the build with `withSentryConfig`. Source-map upload only runs when `SENTRY_*` env vars are set.
- Sentry: `instrumentation.ts` + `sentry.{client,server,edge}.config.ts`. No-op when DSN unset.
- Env vars: see `.env.example`. Only `ANTHROPIC_API_KEY` is needed to run the Ask feature locally; everything else has safe dev fallbacks.

## Conventions
- Path alias `@/*` maps to `apps/docs/*`.
- Use markdown link syntax for code references in chat (per IDE setup), and prefer `source.getPages()`/the taxonomy modules over re-deriving content paths.
- Code highlighting themes are `github-light`/`github-dark` (`source.config.ts`).
