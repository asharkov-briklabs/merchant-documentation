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

## Content & Parity

- [ ] **10. Content depth** — Per-payment-method pages, task-oriented guides/recipes, testing guide,
  changelog / API version history, detailed error-code reference.
- [ ] **11. SEO / discoverability** — `sitemap.ts`, `robots.ts`, OpenGraph images, JSON-LD structured
  data, canonical URLs, hreflang alternates, fix `metadataBase`.
- [ ] **12. i18n at scale** — AI-assisted translation pipeline (machine-translate + human review)
  instead of hand-written `.bg.mdx`; harden the Edge middleware; decide locale routing strategy.
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
