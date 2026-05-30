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
/**
 * Latest `lastUpdated` we accept: tomorrow in UTC. `toISOString()` is always
 * UTC, and the one day of slack absorbs authors in timezones ahead of UTC who
 * date a doc "today" in their local time just before UTC midnight.
 */
const maxLastUpdated = (() => {
  const now = new Date();
  const tomorrowUtc = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  return new Date(tomorrowUtc).toISOString().slice(0, 10);
})();

export const frontmatterExtension = {
  category: CategoryEnum,
  persona: z.array(PersonaEnum).min(1),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z
    .string()
    .date()
    .refine((value) => value <= maxLastUpdated, {
      message: "lastUpdated cannot be in the future",
    }),
};

export type Persona = z.infer<typeof PersonaEnum>;
export type Category = z.infer<typeof CategoryEnum>;
