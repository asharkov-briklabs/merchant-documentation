# Dependency Upgrade & Framework Migration Plan

Current state: Next.js 14 / React 18 / fumadocs 13. All major dependencies are 2–3 major versions behind.

Two paths are available. They are not mutually exclusive — Path B picks up where Path A leaves off.

---

## Path A — Upgrade in-place (stay on Next.js)

Estimated effort: **2–3 days**

### Step 1 — React 18 → 19

```bash
pnpm add react@19 react-dom@19
pnpm add -D @types/react@19 @types/react-dom@19
```

- `ReactDOM.render` is removed (not used here — no action needed)
- Strict mode double-invokes effects in dev; verify the Ask AI panel and search overlay behave correctly

---

### Step 2 — Next.js 14 → 15

```bash
npx @next/codemod@canary upgrade latest
pnpm add next@15 eslint-config-next@15
```

The official codemod handles most of it. Verify manually:

- `params` and `searchParams` in every `page.tsx` / `layout.tsx` are now `Promise<{...}>` — must be `await`-ed. Scan all route files under `app/`.
- `cookies()` and `headers()` from `next/headers` are now async.
- `next/font` API is unchanged.

---

### Step 3 — fumadocs 13 → 16

```bash
pnpm add fumadocs-core@16 fumadocs-ui@16 fumadocs-mdx@15
```

This is the largest step. Reference the [fumadocs migration guide](https://fumadocs.dev/docs/migration).

Key breaking changes:

- `DocsLayout` props reorganised — `nav.component` renamed, sidebar slot API updated
- `loader()` in `lib/source.ts` has new option shape
- `source.config.ts` collection API changed — `defineDocs` options restructured
- `RootToggle` and product-switcher props differ from v13

Payoff: once on fumadocs 16, the entire custom `app/api-reference/` shell (5 bespoke components, 45 hand-authored MDX files) can be **deleted** and replaced by the native fumadocs-openapi v10 layout generated from `openapi.yaml`.

---

### Step 4 — fumadocs-openapi 4 → 10

```bash
pnpm add fumadocs-openapi@10 shiki
```

Requires fumadocs-core 16 (Step 3). v10 introduces `createOpenAPI` / `createAPIPage` and a new source plugin that replaces the v4 `generateFiles` + `attachFile` approach.

- Replace `scripts/generate-api.mjs` with the v10 generation script
- Replace `lib/api-source.ts` with the v10 source setup
- Replace `app/api/layout.tsx` and `app/api/[[...slug]]/page.tsx` with the v10 `<APIPage />` component
- Delete the old `app/api-reference/` custom shell entirely

---

### Step 5 — AI SDK 4 → 6 and @ai-sdk/anthropic 1 → 3

```bash
pnpm add ai@6 @ai-sdk/anthropic@3
```

- `streamText`, `generateText` import paths changed
- Update `app/api/ask/route.ts` — the stream helper and provider initialisation differ in v6
- Test the Ask AI panel end-to-end after upgrading

---

### Step 6 — TypeScript 5 → 6

```bash
pnpm add -D typescript@6
```

Mostly additive. Run `pnpm type-check` and fix any narrowing regressions.

---

### Step 7 — Tailwind 3 → 4 and tailwind-merge 2 → 3

```bash
npx @tailwindcss/upgrade
pnpm add -D tailwindcss@4 postcss@latest
pnpm add tailwind-merge@3
```

**Largest CSS risk.** v4 eliminates `tailwind.config.ts` — all configuration moves into CSS via `@theme {}` blocks in `globals.css`.

- The `vinr-*` color palette, font tokens, and custom shadows all migrate from `tailwind.config.ts` to CSS variables
- Review the codemod output manually — it handles ~80 % of the migration but custom plugins need manual work
- `tailwind-merge` v3 aligns with Tailwind v4's new class names

---

### Step 8 — ESLint 8 → 9/10

```bash
pnpm add -D eslint@9
```

v9 requires flat config (`eslint.config.js`). The legacy `.eslintrc.*` format is removed. `eslint-config-next` v15 ships a flat config export.

---

### Step 9 — Remaining minor updates

```bash
pnpm add lucide-react@latest zod@4
```

- **lucide-react**: some icon names changed between 0.400 and 1.x — run lint and fix any missing icons
- **zod v4**: no API changes for the schemas used here (`z.string()`, `z.enum()`, etc.)

---

## Path B — Remove Next.js, switch to React Router v7

Estimated effort: **3–5 additional days after Path A**

### Background

fumadocs moved from "Next.js only" to "Next.js first + React Router / TanStack Start / Waku" in v15.2. React Router v7's RSC support is still experimental, but its framework mode (loaders, actions, streaming, Vite) is production-ready. Removing Next.js is viable.

**Reasons to switch:**
- Vite-based development — significantly faster HMR and cold starts
- React Router's file-based routing is simpler and more explicit
- Less vendor lock-in to Vercel-specific Next.js features
- React Router v7 on Vercel works via `@react-router/vercel` adapter

**Reasons to stay on Next.js:**
- fumadocs' RSC-heavy components (sidebar, search, TOC) are most tested on Next.js
- React Router RSC is experimental — some fumadocs server components may need client-side alternatives
- Next.js image optimisation (`next/image`) has no direct equivalent in React Router

---

### Step 10 — Scaffold React Router v7 alongside the existing app

```bash
pnpm add react-router @react-router/node @react-router/serve
pnpm add -D @react-router/dev
pnpm add @react-router/vercel
```

Keep `content/`, `lib/`, and `openapi.yaml` in place. Only the `app/` directory structure changes.

---

### Step 11 — Migrate routing

| Next.js (current) | React Router v7 |
|---|---|
| `app/docs/[[...slug]]/page.tsx` | `app/routes/docs.$slug.tsx` |
| `app/api/[[...slug]]/page.tsx` | `app/routes/api.$slug.tsx` |
| `app/api-reference/[[...slug]]/page.tsx` | `app/routes/api-reference.$slug.tsx` |
| `app/personas/[persona]/page.tsx` | `app/routes/personas.$persona.tsx` |
| `app/layout.tsx` | `app/root.tsx` |
| `middleware.ts` | `entry.server.ts` |

---

### Step 12 — Migrate API route handlers to React Router actions/loaders

| Next.js route handler | React Router equivalent |
|---|---|
| `POST /api/ask` | `action()` in `routes/api.ask.ts` with streaming via `eventStream()` |
| `GET /api/search` | `loader()` in `routes/api.search.ts` |
| `POST /api/feedback` | `action()` in `routes/api.feedback.ts` |
| `GET /api/md/[[...slug]]` | `loader()` in `routes/api.md.$slug.ts` |

---

### Step 13 — Replace Next.js-specific imports

| Next.js | React Router v7 |
|---|---|
| `next/link` | `react-router` → `<Link>` |
| `next/navigation` → `useRouter`, `usePathname` | `react-router` → `useNavigate`, `useLocation` |
| `next/image` | standard `<img>` with CSS, or `@unpic/react` |
| `next/font` | Fontsource packages or standard `@font-face` |
| `NextResponse`, `NextRequest` | Web `Response`, `Request` |

---

### Step 14 — Remove Next.js

```bash
pnpm remove next eslint-config-next @sentry/nextjs
pnpm add @sentry/react
pnpm add -D eslint-plugin-react-router
```

Delete: `next.config.mjs`, `middleware.ts`, `sentry.{client,server,edge}.config.ts`

Update: `instrumentation.ts` → React Router's `entry.server.ts` Sentry init pattern

---

## Option C — Migrate to Astro + Starlight (full rewrite)

A third option worth considering if the goal is a clean break from the React/Next ecosystem.

**Astro Starlight** is purpose-built for documentation sites. It is framework-agnostic, zero-JS by default (pages ship no JavaScript unless you add interactive islands), and has its own OpenAPI integration plugin. It is the closest equivalent to fumadocs that does not require Next.js or React Router.

**Effort:** 1–2 weeks. Nearly everything is a rewrite — routing, components, MDX configuration, and the AI assistant. The content MDX files themselves are largely portable.

Worth evaluating if the team wants to step back from the React-heavy stack entirely.

---

## Recommended order

1. **Do Path A in full first.** The upgrade codemod tooling for Next.js 15 and Tailwind 4 is mature. Path A also lets you delete the custom `app/api-reference/` shell (a net reduction in code) and gets fumadocs-openapi v10 working natively.

2. **Then decide on Path B.** Switching to React Router v7 is a separate, optional step. If the team values Vite-based DX and wants to reduce Next.js lock-in, do it after Path A stabilises. If RSC in React Router becomes stable (likely in 2025), the migration will be smoother.

3. **Consider Option C only** if the site is being significantly redesigned at the same time. A Starlight migration makes most sense when paired with a content or branding overhaul.
