// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      category: z.enum([
        "getting-started",
        "integration",
        "payments",
        "compliance",
        "operations",
        "api-reference",
        "troubleshooting"
      ]).optional(),
      persona: z.array(
        z.enum([
          "developer",
          "finance-manager",
          "operations",
          "compliance-officer",
          "business-owner",
          "partner"
        ])
      ).optional(),
      priority: z.enum(["P0", "P1", "P2"]).default("P1"),
      lastUpdated: z.string().optional()
    })
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
