import { z } from "zod";

/**
 * VINR Docs content schema — single source of truth for frontmatter metadata.
 *
 * These fields are layered onto fumadocs' base `frontmatterSchema` (which
 * already supplies title/description/icon/etc.) inside `source.config.ts`,
 * and are enforced by Zod at build time. They are required, so the build
 * fails on any doc page missing them.
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
 * Extension fields, expressed as a raw shape so `source.config.ts` can pass
 * them straight to `frontmatterSchema.extend(...)`.
 */
export const frontmatterExtension = {
  category: CategoryEnum,
  persona: z.array(PersonaEnum).min(1),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z
    .string()
    .date()
    .refine((value) => value <= new Date().toISOString().slice(0, 10), {
      message: "lastUpdated cannot be in the future",
    }),
};

export type Persona = z.infer<typeof PersonaEnum>;
export type Category = z.infer<typeof CategoryEnum>;
