import { source } from "@/lib/source";
import { createSearchAPI } from "fumadocs-core/search/server";
import { CategoryEnum, type Category } from "@/lib/schema";

// A doc's search category is its frontmatter `category` when set, otherwise
// its top-level content folder (content/docs/<category>/...). This keeps the
// facet exhaustive without requiring every doc to be tagged, and lets
// frontmatter override the folder default. Docs that belong to no category
// (e.g. the docs landing page) get an empty tag: they still appear in
// unfiltered search but match no category chip. The tag must always be a
// string — flexsearch indexes it eagerly and throws on `undefined`.
function categoryTag(filePath: string, frontmatter?: Category): string {
  if (frontmatter) return frontmatter;
  const segment = filePath.split("/")[0];
  const parsed = CategoryEnum.safeParse(segment);
  return parsed.success ? parsed.data : "";
}

// Build-time guard: every top-level content folder must be a known category,
// otherwise its docs silently get an empty search tag (the bug that hid the
// `guides`/`changelog` folders). Throws during `next build` if they drift.
const KNOWN_CATEGORIES = new Set<string>(CategoryEnum.options);
const untaggedFolders = Array.from(
  new Set(
    source
      .getPages()
      .map((page) => page.file.path.split("/")[0])
      // Top-level docs (e.g. index.mdx) have no folder segment — skip them.
      .filter((segment) => segment.endsWith(".mdx") === false)
  )
).filter((folder) => !KNOWN_CATEGORIES.has(folder));

if (untaggedFolders.length > 0) {
  throw new Error(
    `Content folders missing from CategoryEnum (lib/schema.ts): ${untaggedFolders.join(
      ", "
    )}. Add them so their docs are searchable by category.`
  );
}

export const { GET } = createSearchAPI("advanced", {
  tag: true,
  indexes: source.getPages().map((page) => ({
    id: page.url,
    title: page.data.title,
    description: page.data.description,
    url: page.url,
    tag: categoryTag(page.file.path, page.data.category),
    structuredData: page.data.structuredData,
  })),
});
