# VINR Design System

A design system distilled from the **VINR** brand — built atop **shadcn/ui**, with a custom brand palette anchored on a deep teal (`#0b3b45`), the "Zinc" neutral scale, and Inter / Roobert typography.

This system is intended for designing **VINR Barracuda Merchants** (a payments/billing/commerce dashboard family) and any companion marketing/docs surfaces. Components are wired against shadcn/ui primitives so a code implementation can be swapped in 1:1.

---

## Sources

| Source | Notes |
|---|---|
| `VINR BARRACUDA MERCHANTS.fig` | Merchant dashboard screens — onboarding, customers, billing, invoices, quotes, subscriptions, plans, terminals, settings, etc. (38 pages, 354 frames). |
| `shadcn VINR.fig` | Full shadcn/ui kit branded with VINR tokens — Pro Blocks application shells, sidebar blocks, sign-in screens, and every shadcn component (61 pages, 254 frames). |

Both Figma files were attached as virtual filesystems; we don't have public Figma URLs to share, but anyone with view access to those files can re-explore them. The original asset library lives in `/Assets/*` (Brandmark, Full-logo, Crypto-Icon, Flag, Payment-Method-Icon, Store-Badge, Cursor, Social-Media-Icon).

There is no codebase attached. All UI recreation is from the Figma JSX pseudocode + the shadcn/ui code conventions it mirrors.

---

## What's in the box

```
README.md                    ← you are here
SKILL.md                     ← Agent Skills entrypoint
colors_and_type.css          ← all CSS variables + base typography + primitives
fonts/                        ← (none bundled — see Fonts section)
assets/                       ← logos, payment-method SVGs
preview/                      ← cards rendered in the Design System tab
ui_kits/
  merchants/                  ← VINR Barracuda Merchants dashboard (recreation)
    README.md
    index.html                ← clickthrough prototype
    *.jsx                     ← components
  shadcn/                     ← shadcn-VINR component library reference
    README.md
    index.html
    *.jsx
```

---

## Content fundamentals

VINR's Figma is a product-doc surface, not marketing copy, so the voice is **direct, second-person, professional, no marketing fluff**. Examples drawn from the kit:

- **You / your, never we.** "Manage your projects" • "View docs" • "Your subscriptions"
- **Sentence case for everything** — page headers, buttons, table headers. ("Sign in", not "Sign In"; "View docs", not "View Docs"). The only Title Case lives in proper-noun product names ("Pro Blocks / App Shell / 01").
- **Verbs first on actions.** Buttons read as commands: "View docs", "Add user", "Open variables", "Edit variable".
- **Numbers speak.** Tables and dashboards lean heavily on currency, counts, and timestamps; copy stays out of the way of the data.
- **No emoji.** The kit contains zero emoji glyphs in any visible string. Status is communicated with icons + color, not 🎉.
- **Lowercase token names.** `zinc-100`, `brand teal-900`, `border radius/sm` — everything programmatic is kebab-case lowercase.
- **Inline hex + rgb on swatches** — designers expect both notations side-by-side.
- **Documentation tone is conversational but tight.** "This UI kit was designed to streamline the design and development process." "First, deselect everything on your canvas." Short imperative sentences; avoid hedging.

If you're writing new copy: keep it short, lead with the verb, address the reader directly, never apologize, never celebrate.

---

## Visual foundations

### Color
- **Primary** is `--vinr-teal-700` `#0b3b45` — the dominant ink color (used 3,200+ times in the source). It pairs with `--vinr-teal-50` `#f7fdfc` on dark surfaces.
- **Secondary brand teal** `#2a9d90` for accents inside data viz / badges.
- **Brand lime** `#225f47` and **brand blue** `#0052b4` round out the secondary palette (used sparingly for charts and category tags).
- **Neutrals** are the "Zinc" scale — `#fafafa → #616363` — slightly cool/desaturated. Always prefer a Zinc tone over `gray` or `slate`.
- **Accent purple** `#9747ff` is a *system* color (used to dash-outline Figma frames and call out doc UI), **not** a brand color — don't pull it into product UI.
- **Yellow** `#ffda44` is a flag/highlight color, not a warning.
- **Destructive** `#d80027` (with deeper `#a2001d` for pressed states).

### Type
- **Inter** is the workhorse for product UI — Regular 14/20 is by far the most used size. Medium 14/20 for emphasis and labels. Semibold 14–24 for headings inside product. Bold 24–36 for hero headings.
- **Roobert** appears for marketing/docs hero typography (Semibold 36/48, Bold 48–72). Treat it as the *display* family.
- **Roboto Mono / Geist Mono / Monument Grotesk Mono** are used in tiny, technical contexts: code snippets, hex values, IDs.
- **Caveat (Bold)** appears as a hand-written script accent at 32–44px — purely decorative, very sparingly.
- Default weight: 400. Headings: 600. Hero/display: 700.

### Spacing
- 4-pt grid. Most layouts use 16/24/32 for padding, 8/12/16 for inner gaps.
- Cards: 24px padding all sides.
- Page gutters: 128px (desktop hero), 24px (app shell).

### Backgrounds
- Page background `#fafafa` (light) or `#05191d` (dark). **No gradients** in product surfaces.
- A **noise/grain texture** appears on landing/marketing hero backgrounds occasionally — never on app surfaces.
- Cards use solid white over `#fafafa` page bg with a 1px `#f4f6f6` border and a near-zero shadow (`0 1px 2px 0 rgba(0,0,0,0.05)`). Soft, almost flat.

### Borders
- **Primary border:** `#e7ebec` (zinc-500). Almost always 1px solid.
- **Subtle border** `#f4f6f6` for low-emphasis dividers.
- Dashed purple borders `#9747ff` are *Figma documentation chrome only* — never ship them.

### Shadows / elevation
- **Shadow-xs:** `0 1px 2px 0 rgba(0,0,0,0.05)` — cards, default.
- **Shadow-sm:** `0 1px 3px ... + 0 1px 2px ...` — popovers, dropdowns.
- **Shadow-md/lg:** dialogs, sheets.
- All shadow alpha falls off fast — VINR is a *flat-leaning* aesthetic; elevation is a hint, not a stage light.

### Corner radii
- `4px` — checkboxes, tiny menu rows
- `6px` — **default** (buttons, inputs, badges)
- `8px` — cards, popovers, dialogs
- `12px` — large feature tiles (color swatches, hero cards)
- `9999px` — pills, avatars

### Animation / motion
- Subtle, fast — typical 120–200ms ease for hover/focus state changes.
- No bounces, no springy overshoots, no parallax.
- Loading is communicated with **Skeleton blocks** (zinc-200 fill, no shimmer) or a small Sonner toast.

### Hover / press states
- **Hover:** background lifts to next neutral (e.g. `zinc-100 → zinc-200`), or tints toward `teal-50` for primary surfaces. No darkening filters.
- **Press:** color steps a notch deeper; no scale transforms.
- **Focus ring:** 3px `rgba(11,59,69,0.12)` halo + 1px `teal-700` border.
- **Disabled:** 50% opacity, cursor not-allowed.

### Cards
- 1px subtle border, 8–12px radius, `shadow-xs`, white background, 24px padding. The card *header* (`Card / Header`) is the most-instanced component in the file (181 instances) — almost every dashboard surface is built from cards.

### Layout rules
- Sticky top navbar (64px desktop, 56px mobile).
- Sidebar at 240–260px for app shells; collapses to 56px icon-rail.
- Content max-width 1280px on most product pages; documentation centers a 680px reading column inside a 1440px frame.

### Imagery / illustration
- The kit ships **no illustrated marketing graphics**. Marketing/blog hero slots are filled with **photographic crops** of products/customers (warm-neutral color palette, slight desaturation).
- No hand-drawn illustrations, no isometric 3D, no AI-art mascots.

### Use of transparency / blur
- **Rare.** A few documentation overlays use `rgba(255,255,255,0.8)` for swatch labels over a colored chip. No frosted glass nav bars.

### Iconography
- **Lucide** — the entire `/Icons/Lucide-Icons` page is a Lucide set. 1.5px stroke, no fill. Use `lucide-static` from CDN for HTML or `lucide-react` in code.
- **Custom: Crypto, Flag, Payment-Method, Store-Badge, Cursor, Social-Media** — these are bespoke SVG sets the kit ships. We've copied a representative slice into `assets/payment/`. Crypto (~150 tokens), Flag (~140 country flags), Store badges (App Store / Play / etc.) are large enough that we leave them in the source Figma — copy in only what a given screen actually needs.
- **Emoji**: never used as iconography.

See `assets/` for the brand glyph (the `V`-arrow over a teal block) and the payment slice.

---

## Index — file manifest

| File | Purpose |
|---|---|
| `colors_and_type.css` | All CSS variables + typography + button/input/card/badge primitives. Import this once and you have the system. |
| `assets/logo-vinr-mark-light.svg` / `-dark.svg` / `-glyph.svg` | The brand mark (V-glyph in a tile). |
| `assets/payment/*.svg` | Visa, AMEX, Apple Pay, Klarna, Stripe, Affirm, Bitcoin, Shop Pay. |
| `preview/*.html` | Card specimens for the Design System tab — colors, type, spacing, components, brand. |
| `ui_kits/merchants/` | VINR Barracuda Merchants dashboard recreation. |
| `ui_kits/shadcn/` | shadcn-VINR component library reference. |
| `SKILL.md` | Cross-compatible Agent Skills entrypoint. |

---

## Caveats / known substitutions

- **Roobert** is a paid commercial typeface; we have no font file and the system falls back to **Inter** for display weights. If you have a Roobert license, drop the `.woff2` files into `fonts/` and update the `--font-display` declaration.
- **Geist Mono / Monument Grotesk Mono** are not bundled — we substitute **Roboto Mono** from Google Fonts. Visually similar.
- **Caveat** is loaded from Google Fonts as a 1:1 match.
- The Figma JSX is pseudocode; per-character text styles, gradient stops, and deeply nested instance overrides may not be exact. Component implementations here are simplified — they look right but are not production-grade.
- The whole kit was built as a Figma file, not as a shipping codebase, so visuals are authoritative and behavior is inferred. Any animation/motion/interaction details should be re-confirmed before production.
