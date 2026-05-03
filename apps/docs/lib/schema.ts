import { z } from "zod";

/**
 * VINR Docs content schema — 6 frontmatter fields (Phase 1)
 * Validated by Zod at build time.
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

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: CategoryEnum,
  persona: z.array(PersonaEnum).min(1),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z.string().date(),
});

export type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Persona = z.infer<typeof PersonaEnum>;
export type Category = z.infer<typeof CategoryEnum>;
