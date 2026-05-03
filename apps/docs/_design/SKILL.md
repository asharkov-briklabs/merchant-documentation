# VINR Design System — Skill

A design system distilled from VINR brand assets (Barracuda Merchants payments dashboard + a fully-branded shadcn/ui kit). Use this skill when designing surfaces in the VINR family.

## When to use
- Designing **dashboards, billing UI, customer/invoice tables, payment flows** for any VINR product surface.
- Building docs, marketing pages, or auth screens that need to match the VINR brand.
- Any time the user mentions VINR, Barracuda Merchants, or asks for a payments/SaaS dashboard look.

## Core artifacts
- `colors_and_type.css` — drop this into any HTML file to inherit all CSS variables, base typography, and primitive utility classes (`.btn`, `.card`, `.badge`, `.input`).
- `assets/logo-vinr-mark-light.svg` / `-dark.svg` / `-glyph.svg` — brandmark.
- `assets/payment/*.svg` — Visa, AMEX, Apple Pay, Stripe, Klarna, Affirm, Shop Pay, Bitcoin.
- `ui_kits/merchants/` — full dashboard with sidebar, topbar, KPI cards, data tables, drawer.
- `ui_kits/shadcn/` — shadcn/ui primitives restyled to VINR.
- `preview/*.html` — color, type, spacing, component, brand specimens.

## Cheat sheet
- **Primary color:** `#0b3b45` (teal-700) on `#f7fdfc` (teal-50).
- **Neutrals:** Zinc scale only (`#fafafa → #2c2e2e`). Never `gray-*` or `slate-*`.
- **Type:** Inter throughout; Roboto Mono for IDs/numerics; Caveat as a script accent (rare).
- **Default radius:** 6 px. Cards 8 px. Pills 9999 px.
- **Cards:** white on `#fafafa` page bg, 1 px `#f4f6f6` border, `0 1px 2px rgba(0,0,0,.05)` shadow, 24 px padding.
- **Tone:** Direct second-person, sentence case, verbs first, no emoji, no marketing fluff.
- **Icons:** Lucide, 1.5 px stroke, no fill.

## Caveats
- Roobert (display) and Geist Mono are not bundled — Inter and Roboto Mono are licensed substitutes; visuals stay tight.
- Component code in `ui_kits/` is a visual recreation, not production-grade. For production, swap in `shadcn/ui` from npm — the styles are 1:1 compatible.
- `ui_kits/merchants/` covers Home, Customers, and Invoices. Other sidebar destinations route to a placeholder card.
