# VINR Barracuda Merchants — UI kit

A click-through recreation of the **VINR Barracuda Merchants** dashboard — a payments / billing / commerce surface in the family of Stripe, Paddle, Lago.

The kit centers on three flows the source Figma covers most heavily: **Home overview**, **Customers**, **Billing / Invoices**.

## What's here

| File | Notes |
|---|---|
| `index.html` | Click-through prototype — sidebar + topbar + 3 main views (Home, Customers, Invoices). |
| `Sidebar.jsx` | Left nav with section groups, brand glyph, store-switcher footer. |
| `Topbar.jsx` | Search, notifications, account menu. |
| `KpiCard.jsx` | Headline stat tile with trend chip and sparkline. |
| `DataTable.jsx` | Compact 8-column table — checkbox row select, status badge, column-header sort. |
| `Drawer.jsx` | Right-side detail drawer (used for invoice + customer detail). |
| `EmptyState.jsx` / `FilterBar.jsx` / `Avatar.jsx` | Supporting components. |

## What we cut

- Onboarding flow (8 frames) — login + two-factor are stubbed, not interactive.
- Quotes, Subscriptions, Plans, Pricing-Tables, Billing-Schedules, Discounts, Usage-based — represented in the sidebar but route to a placeholder card.
- Terminals, Sonar, Reports — placeholder.

The kit is a **visual recreation**, not production code. Every action either toggles local state, opens a drawer, or no-ops.
