# VINR Merchant Documentation

Public docs portal for the [VINR](https://vinr.com) payment platform, deployed at **[docs.vinr.com](https://docs.vinr.com)**.

Built with [Next.js 14](https://nextjs.org) (App Router) and [Fumadocs](https://fumadocs.vercel.app), with an AI-powered "Ask" assistant grounded in the docs content.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Docs engine | Fumadocs (MDX) |
| AI assistant | Claude (`claude-haiku-4-5`) via Vercel AI SDK |
| Embeddings | OpenAI `text-embedding-3-small` |
| Rate limiting | Upstash Redis |
| Error monitoring | Sentry |
| Package manager | pnpm 9 (monorepo) |
| Deployment | Docker / Node / Vercel |

---

## Repository structure

```
.
├── apps/
│   └── docs/                  # @vinr/docs — the Next.js app
│       ├── app/               # App Router pages, layouts, API routes
│       ├── content/docs/      # MDX documentation source
│       ├── lib/               # Source loader, taxonomy, AI retrieval, utilities
│       └── scripts/           # Link checker, embeddings generator
├── Dockerfile                 # Multi-stage production image
├── DEPLOYMENT.md              # Hosting options (Docker, Node, Vercel)
└── package.json               # Root scripts (proxy to @vinr/docs)
```

---

## Getting started

### Prerequisites

- Node ≥ 18.17
- pnpm ≥ 9 (`corepack enable` or `npm i -g pnpm`)

### Install

```bash
pnpm install
```

### Environment variables

Copy the example and fill in the required keys:

```bash
cp apps/docs/.env.example apps/docs/.env.local
```

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes (Ask feature) | Claude API key for the AI assistant |
| `OPENAI_API_KEY` | Yes (Ask feature) | Used to generate and query the embeddings index |
| `NEXT_PUBLIC_SITE_URL` | Yes (production) | Canonical origin, e.g. `https://docs.vinr.com` |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Optional | Durable rate limiting for `/api/ask` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | Google Analytics 4 |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Error monitoring |

See [`apps/docs/.env.example`](apps/docs/.env.example) for the full list.

### Run locally

```bash
pnpm dev        # starts Next.js dev server at http://localhost:3000
```

---

## Available scripts

Run from the repo root:

```bash
pnpm dev          # next dev
pnpm build        # next build (runs fumadocs codegen + embeddings first)
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
pnpm check-links  # validate all internal /docs links
```

> `fumadocs-mdx` codegen (the `.source/` directory) runs automatically before `dev`, `build`, and `type-check` via pre-scripts. Run `pnpm --filter @vinr/docs generate` to trigger it manually.

---

## Content

Documentation lives in `apps/docs/content/docs/<category>/`. Each top-level folder is a category. Pages are MDX files with optional frontmatter:

```yaml
---
title: My Page
category: payments       # overrides folder default (rarely needed)
persona: [developer]     # drives persona-filtered views
priority: P0             # P0 | P1 (default) | P2
lastUpdated: 2026-01-01
---
```

Sidebar ordering is controlled by `meta.json` files alongside the MDX content.

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions. Short version:

**Docker (recommended):**
```bash
docker build -t vinr-docs --build-arg NEXT_PUBLIC_SITE_URL=https://docs.vinr.com .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=sk-ant-... vinr-docs
```

**Plain Node:**
```bash
NEXT_PUBLIC_SITE_URL=https://docs.vinr.com pnpm build
cd apps/docs && ANTHROPIC_API_KEY=... pnpm start
```

---

## Branching strategy

| Branch | Purpose |
|---|---|
| `main` | Production — deployed to docs.vinr.com. Always stable. |
| `develop` | Integration branch — merge all features here first. |
| `feature/<name>` | New content or features, branched from `develop`. |
| `fix/<name>` | Bug fixes, branched from `develop` (or `main` for hotfixes). |
| `hotfix/<name>` | Critical production fixes, branched from `main` and merged back to both `main` and `develop`. |

PRs should target `develop` unless it's a hotfix. `develop` is merged into `main` for each release.

---

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and PR:

1. `type-check`
2. `lint`
3. `check-links`
4. `build`

All four must pass before merging.
