# shadcn-VINR — UI kit reference

A reference page demonstrating the **shadcn/ui component library** restyled with VINR brand tokens. The full set in the source Figma is enormous (61 pages, 254 frames — every shadcn primitive, plus Pro Block app shells, sidebar blocks, and sign-in templates). This page shows the components most commonly composed into the VINR product surfaces.

## What's here

| File | Notes |
|---|---|
| `index.html` | Single-page gallery of components, organized into Inputs, Display, Feedback, Overlay, and Application sections. |
| `components.jsx` | Component implementations (Button, Input, Tabs, Tabs, Tooltip, Dialog, Select, Tabs, Toast, etc.) |

## What's a faithful match vs. what we adapted

- **Faithful**: Buttons, inputs, badges, tabs, alerts, progress, switches, tooltips, breadcrumbs, popovers, table — visual + behavior parity with shadcn defaults restyled to VINR (teal-700 primary, zinc neutrals, 6 px default radius).
- **Adapted**: We swapped Geist Mono → Roboto Mono for monospace because we don't have Geist licensed.
- **Not built**: Calendar, Carousel, Resizable, Drawer (full mobile sheet), Skeleton (we placeholder with a tinted block), Combobox autocomplete, Toggle Group, Form (we show a single form instance, not the full builder API).

For complete shadcn coverage, drop in `shadcn/ui` from npm — these styles are 1:1 compatible with the upstream Tailwind tokens.
