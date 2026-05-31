# VINR Docs — Roadmap to State-of-the-Art ("Better than Stripe")

> **Thesis:** The API spec is the kernel; docs, SDKs, AI, and agents are all projections of it,
> and CI proves every projection is true. Optimize for the AI agent that increasingly *reads the
> docs and writes the integration* — while remaining the best human experience too.

---

## Foundation (do first)

- [ ] **1. Spec-first OpenAPI foundation** — Author an OpenAPI 3.1 spec as the kernel/source of truth
  *before* writing content, then generate the API reference with `fumadocs-openapi` (language tabs,
  request/response samples, schema tables).
- [ ] **2. Executable / tested docs** — Run every code sample in CI against the sandbox on each commit;
  fail the build on drift; surface real "verified against API vX" freshness badges.
- [ ] **3. Agent-native layer** — MCP server for docs + sandbox API, per-page raw markdown endpoints,
  "Copy as Markdown" / "Open in Claude" buttons, and a full `llms-full.txt`.
- [ ] **4. Ask AI → real RAG** — Retrieve doc chunks, inject into context, cite source URLs; update to
  the current Claude model; replace in-memory rate limiting with a durable store (Vercel KV / Upstash).
- [ ] **5. Spec-driven artifact generation** — Generate SDKs, Postman/Bruno collections, and the
  changelog from the OpenAPI spec (SDKs become generated artifacts, not hand-written content).

## Differentiators (beat Stripe)

- [ ] **6. Account-aware personalization** — Logged-in docs showing the user's own test keys, webhook
  endpoints, and most recent failed request, deep-linked to the right troubleshooting page.
- [ ] **7. Deep interactivity** — Live "Try it" pre-filled with the user's test key + response inspection,
  a webhook event simulator, embedded runnable sandboxes (StackBlitz/CodeSandbox), and interactive
  payment-lifecycle state diagrams.
- [ ] **8. Closed-loop content quality** — Mine zero-result searches and low-confidence AI answers into
  an auto-generated "docs to write" backlog; AI-to-human escalation that opens a ticket with full
  conversation context.
- [ ] **9. Diátaxis content architecture** — Explicitly separate tutorials / how-to / reference /
  explanation across the information architecture.
- [ ] **9a. Standard vs. Advanced (SME/enterprise) content depth** — Opinionated SME happy path as the
  page body; enterprise depth disclosed below via a consistent `Advanced` block (in-DOM, SEO-safe);
  wholly-enterprise features get badged standalone pages. Design + worked example in
  `notes/standard-vs-advanced-modes.md`.

## Content & Parity

- [ ] **10. Content depth** — Per-payment-method pages, task-oriented guides/recipes, testing guide,
  changelog / API version history, detailed error-code reference.
- [ ] **11. SEO / discoverability** — `sitemap.ts`, `robots.ts`, OpenGraph images, JSON-LD structured
  data, canonical URLs, hreflang alternates, fix `metadataBase`.
- [ ] **12. i18n at scale** — AI-assisted translation pipeline (machine-translate + human review)
  instead of hand-written `.bg.mdx`; harden the Edge middleware; decide locale routing strategy.
  Consider versioning **per country, not per language** — payment methods, regulations, and supported
  flows differ by market, so route/variant on country (e.g. `/de`, `/bg`) rather than language alone.
- [ ] **13. Frontmatter taxonomy** — Populate `category`/`persona`/`lastUpdated` on all docs; use for
  persona-filtered nav and freshness badges; reconcile dead `lib/schema.ts` with `source.config.ts`.

## Systems & Polish

- [ ] **14. Performance & a11y as CI gates** — Core Web Vitals budgets and WCAG checks that block merge.
- [ ] **15. Onboarding telemetry** — Measure time-to-first-successful-API-call as the north-star metric;
  guided, stateful quickstart that detects the first successful call.
- [ ] **16. Status & lifecycle** — Wire the homepage live ticker/uptime to real status data; publish a
  deprecation policy and a changelog with RSS/webhook subscriptions.
- [ ] **17. Polish & Stripe patterns** — "Was this helpful?" feedback widget, inline "Ask AI about this
  page" button, consolidate hardcoded hex/px onto design tokens, analytics.
- [ ] **18. Fix placeholders** — Verify the `editOnGithub` repo target; load or remove the Caveat
  `--font-display` reference.
- [ ] **19. Engineering hygiene** — `.github` CI pipeline (type-check, lint, build), Markdown link
  checker, spell-check, deliberate Fumadocs upgrade cadence.
- [ ] **20. Docs / API versioning** — Add once the API stabilizes (pin API versions like Stripe).
- [ ] **21. Mobile & responsive** — Make sure the docs work well on mobile and across breakpoints (nav,
  code samples, tables, "Try it" panels); test responsive behavior as part of CI/QA.
- [ ] **22. Standard vs. Advanced modes** — Offer two integration modes: *Standard* follows Stripe's
  opinionated, batteries-included approach; *Advanced* leans toward Adyen's lower-level, more
  configurable approach. Let users toggle and surface the right depth of content per mode.

## Migration & Integration Agents (idea)

- [ ] **25. Stripe → VINR migration agent** — An AI-assisted tool that helps merchants migrate from
  Stripe to VINR with minimal friction. Shape is TBD, but possible directions:
  - Analyze an existing Stripe integration (codebase scan or API key introspection) and produce a
    VINR-equivalent configuration / code diff.
  - Interactive CLI or chat agent that walks through each Stripe concept (customers, subscriptions,
    webhooks, etc.) and maps it to the VINR equivalent, generating ready-to-use code snippets.
  - A hosted "migration wizard" embedded in the docs that ingests Stripe export data and outputs
    VINR import-ready payloads.
  - Auto-generate a gap report: what Stripe features the merchant uses that VINR covers vs. what
    is not yet supported, so they can plan the delta.

## E-commerce Platform Plugins

- [ ] **25. E-commerce platform plugins** — Build and publish checkout plugins for the most popular platforms.
  - **Built by Viva**
    - [ ] Shopify — Smart Checkout plugin
    - [ ] WooCommerce — Standard Checkout plugin
    - [ ] WooCommerce — Smart Checkout plugin
    - [ ] PrestaShop — Smart Checkout plugin
    - [ ] OpenCart — Smart Checkout plugin
    - [ ] Magento — Smart Checkout plugin
    - [ ] Shopware 6 — Smart Checkout plugin
  - **Built by Affiliates**
    - [ ] FoxyCart — Viva plugin
    - [ ] Wizishop — Viva plugin
    - [ ] JTL Shop — Viva plugin
    - [ ] Oxatis — Viva plugin

## Production hardening — deferred follow-ups

> Shipped in the `production-hardening` work: security headers, Sentry, durable Upstash
> rate-limiting + global cost cap, Ask-AI file-tracing fix, CI pipeline, and a single
> `NEXT_PUBLIC_SITE_URL` source-of-truth with a prod fail-fast. The two items below were
> intentionally deferred (right choice for Next 14.2 today; revisit on the trigger noted).

- [ ] **23. Nonce-based strict CSP** — The current CSP (`next.config.mjs`) uses
  `script-src 'self' 'unsafe-inline'` because Next's inline hydration scripts + the homepage JSON-LD
  `<script>` need it. Upgrade to a per-request **nonce** so inline scripts are allow-listed and XSS
  is blocked even with inline scripts present. Requires generating the nonce in `middleware.ts` and
  injecting it into both the CSP header and Next's script tags — do this carefully: `middleware.ts`
  is Edge-bundle-sensitive (a past dep bump dragged `__dirname` in and crashed the Edge function).
  Test against fumadocs-ui client components.
- [ ] **24. Sentry client config rename (on Next 15 upgrade)** — `sentry.client.config.ts` is correct
  for Next 14.2 (and the build warning about it is forward-looking only). When upgrading to Next 15+
  / enabling Turbopack, move its contents to `instrumentation-client.ts` — renaming earlier would
  silently disable client-side error tracking on 14.2. Pairs with item 19's upgrade cadence.
