import { source } from "@/lib/source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { i18n } from "@/lib/i18n";

export const { GET } = createI18nSearchAPI("advanced", {
  indexes: i18n.languages.map((locale) => ({
    language: locale,
    indexes: source.getPages(locale).map((page) => ({
      id: page.url,
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      structuredData: page.data.structuredData,
    })),
  })),
});
