import { i18n } from "./i18n";

export function localeHref(locale: string, path: string): string {
  return locale === i18n.defaultLanguage ? path : `/${locale}${path}`;
}
