// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";

// lib/schema.ts
import { z } from "zod";
var PersonaEnum = z.enum([
  "developer",
  "finance-manager",
  "operations",
  "compliance-officer",
  "business-owner",
  "partner"
]);
var CategoryEnum = z.enum([
  "getting-started",
  "integration",
  "payments",
  "compliance",
  "operations",
  "api-reference",
  "troubleshooting"
]);
var frontmatterExtension = {
  // Defaults to the page's top-level folder; set only to classify a doc
  // outside its physical location.
  category: CategoryEnum.optional(),
  persona: z.array(PersonaEnum).min(1).optional(),
  priority: z.enum(["P0", "P1", "P2"]).default("P1"),
  lastUpdated: z.string().date().optional()
};
var CATEGORY_LABELS = {
  "getting-started": "Getting started",
  integration: "Integration",
  payments: "Payments",
  compliance: "Compliance",
  operations: "Operations",
  "api-reference": "API reference",
  troubleshooting: "Troubleshooting"
};
var CATEGORY_TAGS = CategoryEnum.options.map((value) => ({
  name: CATEGORY_LABELS[value],
  value
}));

// source.config.ts
var { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend(frontmatterExtension)
  }
});
var source_config_default = defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark"
      }
    }
  }
});
export {
  source_config_default as default,
  docs,
  meta
};
