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
 * override that default or to add persona/priority targeting.
 */

export const PersonaEnum = z.enum([
  "developer",
  "finance-manager",
  "operations",
  "compliance-officer",
  "business-owner",
  "partner",
]);

export const CategoryEnum = z.enum([
  "getting-started",
  "integration",
  "payments",
  "compliance",
  "operations",
  "api-reference",
  "troubleshooting",
]);

/**
 * Custom fields, expressed as a raw shape so `source.config.ts` can pass them
 * straight to `frontmatterSchema.extend(...)`.
 */
export const frontmatterExtension = {
  // Defaults to the page's top-level folder; set only to classify a doc
  // outside its physical location.
  category: CategoryEnum.optional(),
  persona: z.array(PersonaEnum).min(1).optional(),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z.string().date().optional(),
};

export type Persona = z.infer<typeof PersonaEnum>;
export type Category = z.infer<typeof CategoryEnum>;

/** Human-readable label per category, shared by the search facet and any UI. */
export const CATEGORY_LABELS: Record<Category, string> = {
  "getting-started": "Getting started",
  integration: "Integration",
  payments: "Payments",
  compliance: "Compliance",
  operations: "Operations",
  "api-reference": "API reference",
  troubleshooting: "Troubleshooting",
};

/** Tag items consumed by the fumadocs search dialog for category filtering. */
export const CATEGORY_TAGS = CategoryEnum.options.map((value) => ({
  name: CATEGORY_LABELS[value],
  value,
}));
