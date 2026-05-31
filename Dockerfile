# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────────────────────────────────────
# Portable, platform-agnostic image for the VINR docs app.
#
# A plain Next.js app run with `next start` — no Vercel (or any other platform)
# adapter. Runs anywhere Docker runs: Fly, Railway, Render, Cloud Run, ECS/EKS,
# Kubernetes, or a plain VM.
#
#   docker build -t vinr-docs \
#     --build-arg NEXT_PUBLIC_SITE_URL=https://docs.vinr.com .
#   docker run -p 3000:3000 -e ANTHROPIC_API_KEY=... vinr-docs
#
# NEXT_PUBLIC_* values are inlined into the client bundle at BUILD time, so the
# canonical site URL must be passed as a --build-arg (not just a runtime env).
# Everything else (API keys, Redis, Sentry DSN) is read at runtime.
#
# (`output: "standalone"` would yield a smaller image but redirect-loops the
# root URL under the fumadocs i18n middleware — see next.config.mjs — so we run
# `next start`, which behaves identically to production.)
# ─────────────────────────────────────────────────────────────────────────────

# Pin Node to match CI (Node 20). Alpine keeps the image small.
FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

# ── deps: install with the frozen lockfile (cached unless manifests change) ──
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json ./apps/docs/package.json
RUN pnpm install --frozen-lockfile

# ── builder: compile the app ─────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/docs/node_modules ./apps/docs/node_modules
COPY . .

# Baked into the client bundle at build time. Defaults to the canonical host;
# override with --build-arg for other environments. ALLOW_DEFAULT_SITE_URL lets
# the production build proceed even if the URL arg is omitted.
ARG NEXT_PUBLIC_SITE_URL=https://docs.vinr.com
ARG NEXT_PUBLIC_SENTRY_DSN=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN \
    ALLOW_DEFAULT_SITE_URL=true \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ── runner: production deps + build artifacts, started with `next start` ─────
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run as an unprivileged user.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

# Production-only dependencies (smaller than copying the build's node_modules).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json ./apps/docs/package.json
RUN pnpm install --frozen-lockfile --prod

# Build output + the assets `next start` serves at runtime. content/ is read by
# the Ask-AI retrieval index (lib/docs-retrieval) relative to the app's cwd.
COPY --from=builder --chown=nextjs:nodejs /repo/apps/docs/.next ./apps/docs/.next
COPY --from=builder --chown=nextjs:nodejs /repo/apps/docs/public ./apps/docs/public
COPY --from=builder --chown=nextjs:nodejs /repo/apps/docs/content ./apps/docs/content
COPY --from=builder --chown=nextjs:nodejs /repo/apps/docs/next.config.mjs ./apps/docs/next.config.mjs
COPY --from=builder --chown=nextjs:nodejs /repo/apps/docs/source.config.ts ./apps/docs/source.config.ts

USER nextjs
EXPOSE 3000

# Start from the app dir so process.cwd() === the app root (content/docs lookup).
# Invoke Next's JS entrypoint directly — node_modules/.bin/next is a shell
# wrapper that can't be run via `node`. pnpm links `next` into the workspace
# package's own node_modules.
WORKDIR /repo/apps/docs
CMD ["node", "node_modules/next/dist/bin/next", "start"]
