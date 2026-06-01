import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { frontmatterExtension } from "./lib/schema";

export const { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend(frontmatterExtension),
  },
});

export const { docs: apiDocs, meta: apiMeta } = defineDocs({
  docs: { dir: "content/api/openapi" },
  meta: { dir: "content/api/openapi" },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
