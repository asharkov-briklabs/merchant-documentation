# Plan: Payments docs + API to Stripe/Adyen parity

**Status:** COMPLETE — all phases 0–3, 5–7 shipped 2026-06-01
**Date:** 2026-05-31
**Owner:** Alex
**Sources reviewed:**
- Stripe — https://docs.stripe.com/payments
- Adyen — https://docs.adyen.com/get-started-with-adyen
- Adyen — https://docs.adyen.com/online-payments
- Adyen — https://docs.adyen.com/point-of-sale
- Adyen — https://docs.adyen.com/unified-commerce
- Adyen — https://docs.adyen.com/plugins
- Viva — https://developer.viva.com/

---

## 1. Goal

Bring VINR's payments documentation and Payments API reference to feature parity with
Stripe Payments and Adyen, covering the full breadth they document: online payments (in
depth), in-person / point-of-sale, unified commerce / omnichannel, platforms &
marketplaces, and pre-built plugins — without regressing the existing online-card content
or the house style.

**Non-goals:** Building real backend APIs or SDKs. This is documentation. API-reference
pages remain *illustrative* (representative field names) until the OpenAPI spec lands
(TODO #1) — keep the existing "Illustrative content" callout on new reference pages.

---

## 2. What we already have (baseline — do not duplicate)

`content/docs/payments/` (online, card-centric):
how-payments-work · payment-lifecycle · customers · payment-methods/{cards, bank-transfers,
stablecoins, local-methods} · authorize-and-capture · refunds · disputes ·
recurring-payments · payment-links · multicurrency · strong-customer-authentication ·
fraud-prevention

`content/docs/integration/`: checkout · elements · mobile-sdks · webhooks · testing

`content/docs/api-reference/` Payments API: payments · refunds · payment-methods ·
customers · disputes (+ Money movement: settlements, payouts, balance)

House conventions to follow on every new page:
- Components already registered: `Callout`, `Tabs`/`Tab`, `TypeTable`, `Cards`/`Card`,
  `Accordions`/`Accordion`, `Steps`.
- **Standard/Advanced pattern** (`notes/standard-vs-advanced-modes.md`): opinionated SME
  happy path is the page *body*; enterprise/lower-level depth goes in an `<Accordions>`
  block below. Wholly-enterprise features get their own badged page.
- Frontmatter: `title`, `description`, `persona[]`, `priority` (P0/P1/P2), `lastUpdated`.
  Set `category` only when a doc must be classified outside its physical folder.
- Use `/docs/...` internal links (they're validated by `check-links`).

---

## 3. Gap analysis → what to build

### Gap A — Online payments depth (deepen existing `payments/` + `integration/`)
Adyen's online-payments tree and Stripe's advanced topics are far deeper than ours:
- **Integration models overview**: Sessions flow vs Advanced flow; Drop-in vs Components
  vs API-only. (We have Checkout + Elements but no model-selection guide / advanced flow.)
- **Tokenization depth**: create tokens, token payments, manage tokens, network
  tokenization, account updater. (`recurring-payments` is shallow on this.)
- **3D Secure depth**: native vs redirect, data-only, standalone authentication.
- **Modifications**: reversal and authorization adjustment (we have capture/refund/void).
- **Result/refusal codes** reference.
- **Feature pages**: surcharge, installments, partial authorization, partial payments,
  two-step checkout, donations, instant card funding, online payouts, auto-rescue.

### Gap B — In-person / Point of Sale (NEW product) — entirely missing
Terminal hardware, Terminal API (local vs cloud), Tap to Pay (iOS/Android), in-person
features (tipping, surcharge, gift cards, cashback, DCC, MOTO, manual key entry, offline,
installments), receipts & terminal shopper engagement, fleet/terminal management, mobile
card-reader solutions, standalone terminal.

### Gap C — Unified Commerce / Omnichannel (NEW product) — missing
Cross-channel shopper recognition & shared tokens, endless aisle, click & collect (BOPIS),
buy-online-return-in-store (BORIS), pay-by-link in-store, MOTO, cross-channel loyalty
(bridges to the existing **engagement** product), digital receipts, shopper insights.

### Gap D — Platforms & Marketplaces — DEFERRED (not this round)
Stripe Connect, Adyen for Platforms, and Viva Marketplaces are all **separate top-level
products** in each provider's docs, not sub-sections of Payments. VINR's equivalent should
follow the same pattern: a new top-level category with its own `CategoryEnum` entry,
`CATEGORIES` registry entry, and `ROOTS` product-switcher entry — a larger taxonomy surgery
that warrants its own planning pass. Deferred out of the payments parity scope.

### Gap E — Plugins / Pre-built integrations (NEW product) — missing
Built-by-VINR vs partner plugins for Shopify, WooCommerce, Adobe Commerce (Magento),
Salesforce Commerce Cloud, BigCommerce, PrestaShop, SAP, Oracle NetSuite, etc. Per-plugin:
install · configure · payment methods · tokenization · in-person · go-live · troubleshoot.

### Gap F — API reference additions
Terminal/in-person API (terminals, terminal-payments, terminal-actions), tokens /
network-token instruments, platforms API (connected accounts, transfers, splits),
authorization adjustments & reversals.

---

## 4. Taxonomy changes — DECIDED: nest everything under `payments/`

**Decision (2026-05-31):** the new areas are **sub-sections of the existing Payments
product**, NOT new top-level products. This keeps them all in the `payments` category, so
we avoid most of the taxonomy footgun:
- **No** `CategoryEnum` change in `lib/schema.ts` (no new top-level content folder).
- **No** new `CATEGORIES` entry in `lib/taxonomy.ts`.
- **No** new `ROOTS` product switcher entry in `app/[locale]/docs/layout.tsx`.
- **No** root `content/docs/meta.json` change.

New folders (all under `content/docs/payments/`):
- `payments/in-person/` — Point of Sale / Terminal
- `payments/omnichannel/` — Unified commerce
- `payments/platforms/` — Platforms & marketplaces
- `payments/plugins/` — Pre-built integrations

What we DO still touch:
1. `content/docs/payments/meta.json` — add the new sub-folder slugs and `---group---`
   separators so the Payments sidebar stays organized (it's getting deep — group it well).
2. Each new sub-folder gets its own `meta.json` (+ nested ones for any sub-sub-folders).
3. `lib/nav-taxonomy.ts` — extend the **Payments** `NAV_GROUPS` mega-menu with a few
   curated links to the new areas (hand-picked, not a full projection).
4. `app/[locale]/page.tsx` — optionally add homepage grid links (e.g. a "Collect in person"
   task) — judgment call, low priority.
5. Run `pnpm check-links` after every path/taxonomy edit.

Because the Payments sidebar will grow large, use `meta.json` separators to group it, e.g.
`---Online---`, `---In person---`, `---Omnichannel---`, `---Platforms---`, `---Plugins---`.

---

## 5. Phased execution

Each phase is independently shippable and must end CI-green:
`pnpm type-check && pnpm lint && pnpm check-links && pnpm build`.

### Phase 0 — Foundations (no content)
- [x] Taxonomy decision: nest under `payments/` (§4). **DECIDED.**
- [ ] Add `---Online---` separator + reorganize the current `payments/meta.json` so new
      groups slot in cleanly.
- [ ] Define the per-plugin page template (shared section skeleton).
- [ ] Optionally promote the `Advanced` wrapper from `notes/advanced-component.example.tsx`
      so new pages use one consistent disclosure label.

### Phase 1 — Deepen online payments (Gap A) — no taxonomy changes
Extends existing folders; lowest risk; do first.
New pages in `content/docs/payments/`:
- [x] `tokenization.mdx` — create/store tokens, token payments, network tokenization,
      account updater (split from/links to `recurring-payments`).
- [x] `authorization-adjustment.mdx` — increase/decrease an auth, reversal vs void.
- [x] `surcharging.mdx`, `installments.mdx`, `partial-authorization.mdx`,
      `partial-payments.mdx`, `donations.mdx`, `auto-rescue.mdx` (feature pages; some may
      merge — judge length).
- [x] New `3d-secure.mdx` (or new `3d-secure.mdx`): native vs
      redirect, data-only, standalone.
New page in `content/docs/integration/`:
- [x] `integration-models.mdx` — Sessions vs Advanced flow; Drop-in vs Components vs
      API-only; decision matrix. Cross-link Checkout/Elements.
- [x] `advanced-flow.mdx` — lower-level orchestration (payment session → details → result).
New page in `content/docs/troubleshooting/` (or api-reference):
- [x] `result-codes.mdx` — authorization result + refusal-reason reference table.
- [x] Update `payments/meta.json`, `integration/meta.json`, run `check-links`.

### Phase 2 — In-person / Point of Sale (Gap B)
Create `content/docs/payments/in-person/` + taxonomy edits (§4):
- [ ] `index.mdx` — overview, what's supported, solution types.
- [ ] `terminals.mdx` — hardware models / form factors / selection. Supported devices
      (DECIDED): **Nexgo N92, Nexgo N86Pro, Nexgo CT20, Nexgo CT20P, Ciontek CM30.**
- [ ] `architecture.mdx` — local vs cloud Terminal API; connectivity.
- [ ] `accept-a-payment.mdx` — Terminal API sale flow (Standard/Advanced).
- [ ] `refunds.mdx` — referenced vs unreferenced refunds in person.
- [ ] `tap-to-pay.mdx` — Tap to Pay on iPhone / Android.
- [ ] `features.mdx` — tipping, surcharge, cashback, DCC, MOTO, manual key entry, offline,
      installments, gift cards (split into multiple pages if long).
- [ ] `receipts-and-engagement.mdx` — receipts, terminal display/input prompts.
- [ ] `terminal-management.mdx` — order/board/assign/configure fleet; remote management.
- [ ] `mobile-solutions.mdx` — Android/iOS card-reader + payments-app integration.
- [ ] `standalone-terminal.mdx` — no-POS-app standalone mode.
- [ ] `go-live.mdx` — in-person go-live checklist.
- [ ] `meta.json`; taxonomy sync; `check-links`.

### Phase 3 — Unified Commerce / Omnichannel (Gap C)
Create `content/docs/payments/omnichannel/`:
- [ ] `index.mdx` — omnichannel overview & value.
- [ ] `shopper-recognition.mdx` — cross-channel identification & shared tokens.
- [ ] `endless-aisle.mdx`, `click-and-collect.mdx`, `return-in-store.mdx` (BORIS).
- [ ] `pay-by-link.mdx` (cross-channel) and `moto.mdx`.
- [ ] `cross-channel-loyalty.mdx` — bridge to `engagement/` product.
- [ ] `digital-receipts.mdx`, `shopper-insights.mdx`.
- [ ] `meta.json`; taxonomy sync; `check-links`.

### Phase 4 — Platforms & Marketplaces — DEFERRED
Not in this round. All three reference providers (Stripe Connect, Adyen for Platforms,
Viva Marketplaces) treat this as a separate top-level product. When planned, it will need
its own `CategoryEnum` / `CATEGORIES` / `ROOTS` entries — outside the `payments/` nesting
strategy used here. Track separately.

### Phase 5 — Plugins (Gap E)
Create `content/docs/payments/plugins/` using one template per plugin:
- [ ] `index.mdx` — built-by-VINR vs partner; capability matrix.
- [ ] Page per platform, in this priority order (DECIDED):
      1. `woocommerce.mdx`
      2. `adobe-commerce.mdx`
      3. `salesforce-commerce-cloud.mdx` (SFCC)
      Expand later as needed (Shopify, BigCommerce, PrestaShop, SAP, NetSuite, …).
- [ ] Template sections each: supported methods · install · configure · tokenization ·
      in-person · go-live · troubleshooting.
- [ ] `meta.json`; taxonomy sync; `check-links`.

### Phase 6 — API reference additions (Gap F)
Add to `content/docs/api-reference/` + `api-reference/meta.json` groups:
- [ ] `terminals.mdx`, `terminal-payments.mdx`, `terminal-actions.mdx` (new "In-person
      API" group).
- [ ] `tokens.mdx` (network-token / payment-instrument object).
- [ ] Extend `payments.mdx` with reversal / authorization-adjustment endpoints.
- [ ] Keep the "Illustrative content" callout; reconcile with OpenAPI later (TODO #1, #5).
- Note: `connected-accounts.mdx` and `transfers.mdx` are deferred with Phase 4.

### Phase 7 — Glue, guides, polish
- [ ] New task guides in `content/docs/guides/`: `collect-in-person-payment.mdx`,
      `go-omnichannel.mdx`, `install-the-woocommerce-plugin.mdx`.
      (`onboard-a-platform-merchant.mdx` deferred with Phase 4.)
- [ ] Homepage grids + persona pages: surface new products.
- [ ] `changelog/index.mdx` entry summarizing the expansion.
- [ ] Final full CI pass; spot-check nav, search facets, mega-menu, mobile.

---

## 6. Risks & mitigations
- **Taxonomy drift** → strictly follow §4 checklist; `check-links` after each phase.
- **Edge-runtime breakage** (`middleware.ts`) → content-only changes are safe; avoid new
  Node imports in i18n/nav graph.
- **Scope creep / length** → split-vs-merge feature pages by judgment; ship phases
  incrementally rather than one mega-PR.
- **Illustrative vs real API** → retain the callout; do not imply unbuilt endpoints exist.
- **Bilingual** → author `en` only (i18n is single-locale per CLAUDE.md).

## 7. Definition of done (per phase)
1. All new pages render and are reachable via sidebar + mega-menu.
2. `pnpm type-check && pnpm lint && pnpm check-links && pnpm build` all pass.
3. New top-level products appear in search facets and product switcher.
4. Cross-links resolve; no orphan pages.

## 8. Decisions & remaining questions
- [x] **Structure:** nest under `payments/` (not new top-level products). DECIDED 2026-05-31.
- [x] **Scope:** Phases 0–3, 5–7 in scope this round. Phase 4 deferred. DECIDED 2026-05-31.
- [x] **Phase 4 (Platforms & Marketplaces) deferred:** Stripe, Adyen, and Viva all ship
      this as a separate top-level product, not under Payments. VINR should follow suit;
      requires new `CategoryEnum`/`CATEGORIES`/`ROOTS` — out of scope here. DECIDED 2026-05-31.
- [x] **Plugin priority (Phase 5):** WooCommerce → Adobe Commerce → SFCC. DECIDED.
- [x] **In-person hardware:** Nexgo N92, Nexgo N86Pro, Nexgo CT20, Nexgo CT20P,
      Ciontek CM30. DECIDED.
