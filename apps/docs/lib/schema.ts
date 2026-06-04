import { z } from "zod";

/**
 * VINR Docs content schema — single source of truth for the custom frontmatter
 * fields. `frontmatterExtension` is layered onto fumadocs' base
 * `frontmatterSchema` (title/description/icon/full/...) inside
 * `source.config.ts` via `.extend(...)`, so the base fields are preserved and
 * the custom fields live in one place.
 *
 * The custom fields are optional: a doc's `category` defaults to its top-level
 * content folder (see the search route), so frontmatter is only needed to
 * override that default or to add priority targeting.
 */

// Must stay in sync with the top-level folders under content/docs. The search
// route (app/api/search/route.ts) derives a doc's category from its top-level
// folder and validates it against this enum — any folder missing here gets an
// empty search tag and becomes unreachable by category filtering. A build-time
// assertion in app/api/search/route.ts enforces that folders ⊆ this enum.
export const CategoryEnum = z.enum([
  "getting-started",
  "guides",
  "integration",
  "payments",
  "billing",
  "engagement",
  "compliance",
  "operations",
  "platforms",
  "industries-and-markets",
  "api-reference",
  "troubleshooting",
  "changelog",
]);

/**
 * Custom fields, expressed as a raw shape so `source.config.ts` can pass them
 * straight to `frontmatterSchema.extend(...)`.
 */
export const frontmatterExtension = {
  // Optional override. There is NO schema-level default: when omitted, a doc's
  // category is computed from its top-level folder by the search route
  // (app/api/search/route.ts). Set this only to classify a doc outside its
  // physical folder.
  category: CategoryEnum.optional(),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z.string().date().optional(),
  // Marks a page as part of the onboarding quickstart funnel. Pages with this
  // flag render a QuickstartTracker that fires GA4 funnel events and persists
  // progress in localStorage. Order is defined in lib/onboarding.ts.
  quickstartStep: z.boolean().optional(),
  // Wholly-enterprise pages (the second mechanism of the Standard/Advanced
  // content model — see notes/standard-vs-advanced-modes.md). The page stays in
  // the sidebar for everyone; it just gets an "Enterprise" badge so SMEs know
  // it isn't aimed at them. Inline `Advanced` accordions cover the common case
  // of a shared flow that forks; this flag is only for pages that are entirely
  // enterprise (whole endpoints/features an SME never touches).
  enterprise: z.boolean().optional(),
};

export type Category = z.infer<typeof CategoryEnum>;
export type Priority = "P0" | "P1" | "P2";

// Per-category labels/icons/descriptions now live in lib/taxonomy.ts (the
// single registry) so the search facet, sidebar product switcher, and any UI
// can't drift apart. CATEGORY_LABELS / CATEGORY_TAGS are re-exported from there.
