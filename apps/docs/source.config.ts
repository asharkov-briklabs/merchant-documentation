import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { frontmatterExtension } from "./lib/schema";

export const { docs, meta } = defineDocs({
  docs: {
    schema: frontmatterSchema.extend(frontmatterExtension),
  },
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
