import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { frontmatterExtension } from "./lib/schema";

export const { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend(frontmatterExtension),
  },
});

// content/api/openapi/ — old fumadocs-openapi v4 generated MDX files — is no
// longer compiled. API docs now use openapi.staticSource() (lib/api-source.ts)
// which reads openapi.yaml directly without pre-generated MDX files.

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
