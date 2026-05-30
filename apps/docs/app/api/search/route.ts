import { source } from "@/lib/source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { i18n } from "@/lib/i18n";
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

export const { GET } = createI18nSearchAPI("advanced", {
  tag: true,
  indexes: i18n.languages.map((locale) => ({
    language: locale,
    indexes: source.getPages(locale).map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      tag: categoryTag(page.file.path, page.data.category),
      structuredData: page.data.structuredData,
    })),
  })),
});
