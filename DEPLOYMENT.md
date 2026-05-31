# Deployment

This app is a standard Next.js (14.2, App Router) site and is **not coupled to
any hosting platform**. It runs with `next start` on any host with Node 18.17+
or in Docker — no platform adapter required.

## What it needs

| Variable | When | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **build time** | Canonical origin (e.g. `https://docs.vinr.com`). Inlined into the client bundle, so it must be set when you build. A production build without it fails fast unless `ALLOW_DEFAULT_SITE_URL=true`. |
| `ANTHROPIC_API_KEY` | runtime | Required for the `/ask` AI assistant. |
| `ALLOW_DEFAULT_SITE_URL` | build time (optional) | `true` lets a build fall back to the canonical host instead of failing when the URL is unset. |
| `ALLOWED_ORIGINS` | runtime (optional) | Comma-separated extra origins allowed to call `/api/ask` (same-origin + localhost always allowed). `*.example.com` matches subdomains. |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | runtime (optional) | Durable rate limiting for `/api/ask`. Falls back to in-memory per-instance limiting when unset. Upstash is a hosted Redis over HTTP — works on any platform. |
| `NEXT_PUBLIC_SENTRY_DSN` | build+runtime (optional) | Error monitoring. No-op when unset. `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN` enable source-map upload at build. |

See [apps/docs/.env.example](apps/docs/.env.example) for the full list.

## Option A — Docker (recommended, runs anywhere)

A multi-stage [Dockerfile](Dockerfile) builds the standalone server into a
minimal image. Works on Fly, Railway, Render, Cloud Run, ECS/EKS, Kubernetes,
or a plain VM.

```bash
# Build (bake the canonical URL into the client bundle)
docker build -t vinr-docs --build-arg NEXT_PUBLIC_SITE_URL=https://docs.vinr.com .

# Run
docker run -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -e UPSTASH_REDIS_REST_URL=... \
  -e UPSTASH_REDIS_REST_TOKEN=... \
  vinr-docs
```

The container listens on `PORT` (default `3000`) and binds `0.0.0.0`.

## Option B — plain Node host

```bash
pnpm install --frozen-lockfile
NEXT_PUBLIC_SITE_URL=https://docs.vinr.com pnpm build

# Start the server. Run it from the app dir so process.cwd() is the app root —
# the Ask-AI index reads content/docs relative to cwd.
cd apps/docs
ANTHROPIC_API_KEY=... PORT=3000 pnpm start   # = next start
```

Put it behind a process manager (systemd, pm2) or a reverse proxy (nginx,
Caddy) as you would any Node service.

## Notes on portability

- **No platform adapter.** The Edge middleware (i18n) and Edge routes (`/icon`,
  `/opengraph-image`) are served by Next's own runtime under `next start` — they
  don't require Vercel.
- **`next start`, not `output: standalone`.** Standalone yields a smaller image
  but redirect-loops the root URL under the fumadocs i18n middleware
  (default-locale hiding), so it's intentionally not used. See the note in
  [next.config.mjs](apps/docs/next.config.mjs).
- **`vercel.json`** is opt-in config for *if* you deploy on Vercel. It's ignored
  everywhere else and creates no code-level dependency. Delete it if you leave
  Vercel entirely.
- **Content for Ask-AI** (`content/docs`) is read at runtime relative to the
  process working directory; on serverless platforms it's bundled via
  `outputFileTracingIncludes` in [next.config.mjs](apps/docs/next.config.mjs).
