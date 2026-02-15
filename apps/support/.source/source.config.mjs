// source.config.ts
import { defineCollections, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var merchant = defineCollections({
  type: "doc",
  dir: "content/merchant",
  schema: frontmatterSchema.extend({
    full: z.boolean().optional()
  })
});
var banks = defineCollections({
  type: "doc",
  dir: "content/banks",
  schema: frontmatterSchema.extend({
    full: z.boolean().optional()
  })
});
export {
  banks,
  merchant
};
