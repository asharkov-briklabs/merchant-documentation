import type { I18nConfig } from "fumadocs-core/i18n";

// Single-locale for now. The `bg` (Bulgarian) locale was removed because there
// was no Bulgarian content — every /bg/docs/* page 404'd (Fumadocs has no
// cross-locale content fallback). The bilingual UI scaffolding (translations,
// per-link labels) is preserved in git history; re-add "bg" here and ship
// *.bg.mdx content together when Bulgarian launches.
export const i18n: I18nConfig = {
  defaultLanguage: "en",
  languages: ["en"],
  hideLocale: "default-locale",
};

export const localeNames: Record<string, string> = {
  en: "English",
};
