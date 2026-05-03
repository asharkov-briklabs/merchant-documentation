import type { I18nConfig } from "fumadocs-core/i18n";

export const i18n: I18nConfig = {
  defaultLanguage: "en",
  languages: ["en", "bg"],
  hideLocale: "default-locale",
};

export const localeNames: Record<string, string> = {
  en: "English",
  bg: "Български",
};
