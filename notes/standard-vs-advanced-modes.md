# Design note: Standard vs. Advanced (SME vs. Enterprise) content depth

**Status:** Decided (approach), not yet implemented
**Date:** 2026-05-31
**Applies to:** Documentation _and_ API reference

## Context

VINR's product genuinely forks: there is a **simple/opinionated** integration surface (Stripe-like,
batteries-included) and a **lower-level/configurable enterprise** surface (Adyen-like). We want the
docs to surface the right depth without making the simple path feel cluttered or the enterprise path
feel hidden.

Two facts shaped the decision:

1. **The API really has two surfaces** — a bundled/opinionated set of calls and a lower-level
   enterprise sequence. So a Standard/Advanced split is honest, not invented.
2. **A given merchant is never in both modes at once** — they self-identify as either an SME or a
   hardcore enterprise. So "mode" is an **audience segment**, not a per-task difficulty dial.

## Approaches considered

### A. Global, sticky Standard/Advanced toggle (rejected)

A persistent binary switch that reshapes the whole site (nav, examples, recommended flows).

Rejected because:
- fumadocs builds the sidebar **server-side**, so a mode needs a cookie for correct first paint —
  otherwise the nav flickers/reshapes on hydration.
- **SEO / deep-linking risk:** content hidden behind the inactive mode is hard to index, and a
  support link can land a customer in the "wrong" mode and show them nothing.
- **2× maintenance / drift**, which fights our single-registry discipline (see `lib/taxonomy.ts`,
  `lib/schema.ts`).

### B. Single canonical page + "Advanced options" disclosed below (CHOSEN)

The opinionated happy path is the body of the page; enterprise depth (extra params, lower-level
flows, edge cases) sits in a consistent, clearly-labeled disclosure block beneath it.

Chosen because it sidesteps every problem above:
- **No persisted state, no SSR flicker, no nav reshaping.**
- **SEO-perfect and deep-linkable** — everything lives on one URL; fumadocs `Accordions` render
  content **in the DOM** (collapsible, not lazy-loaded), so crawlers index it and anchors work.
- **One content tree** — no drift.
- **It's what Stripe actually does** — opinionated path up front, optional params and lower-level
  flows tucked into expandable "advanced" sections. So it's _more_ faithful to the Stripe model, not
  less.

The one cost — an enterprise reader scrolls past SME content to reach their depth — is the right
trade: SMEs are the top-of-funnel majority, and enterprise readers are sophisticated enough to
expand a labeled section.

## The two-mechanism rule

Inline disclosure alone doesn't cover content that is _wholly_ enterprise (whole endpoints/features
an SME never touches — there's no standard page to hang them under). So:

1. **Topic forks within a shared flow → inline progressive disclosure.**
   Standard call is the body; the enterprise variant / extra params sit in an `Advanced` block
   below. Covers the large majority, including most of the API reference (simple call up top, the
   lower-level enterprise sequence in an expandable block beneath).

2. **Wholly enterprise features → their own pages, NOT hidden, just badged.**
   An "Enterprise" tag in the sidebar. Discoverable by everyone, signposted for who they're for.

**Consistency is the make-or-break factor.** Use ONE disclosure convention on every page so readers
learn "expand for enterprise depth" once. Inconsistent placement is what makes progressive-disclosure
docs feel random.

## Implementation notes

- **Disclosure today, zero new code:** `Accordions`/`Accordion` are already registered in
  `app/[locale]/docs/[[...slug]]/page.tsx`. Use `<Accordions><Accordion title="Advanced — …">` for
  the enterprise block. See `notes/example-advanced-disclosure.mdx`.
- **Optional: a thin `<Advanced>` wrapper** for visual consistency + a standard label. It would wrap
  `Accordion` and live alongside the other registered components in `page.tsx`. See
  `notes/advanced-component.example.tsx`. Defer until the pattern proves out — the raw `Accordion` is
  fine to start.
- **Badging enterprise-only pages:** add an `enterprise: true` (or reuse `persona`/`priority`)
  frontmatter flag in `lib/schema.ts`, and render an "Enterprise" tag in the sidebar item. Keep the
  page in nav — badge, don't hide.
- **Keep `mode` OUT of `persona`.** Persona = role (developer, finance-manager); this segment =
  scale (SME, enterprise). If we ever formalize it, it's a new axis that drives _emphasis_, not a
  new copy of the content tree.

## Open items

- [ ] Confirm naming shown to readers (e.g. "Advanced", "Advanced (Enterprise)", "Enterprise setup").
- [ ] Decide whether to add the `<Advanced>` wrapper component or stay on raw `Accordion`.
- [ ] Identify the wholly-enterprise endpoints/features that need badged standalone pages.
- [ ] Pick the first slice to convert (API reference is the highest-confidence place to start).
