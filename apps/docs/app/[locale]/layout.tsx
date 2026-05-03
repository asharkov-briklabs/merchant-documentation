import { I18nProvider } from "fumadocs-ui/i18n";
import type { ReactNode } from "react";
import { i18n, localeNames } from "@/lib/i18n";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <I18nProvider
      locale={params.locale}
      locales={i18n.languages.map((lang) => ({
        name: localeNames[lang] || lang,
        locale: lang,
      }))}
      translations={
        params.locale === "bg"
          ? {
              search: "Търсене",
              searchNoResult: "Няма резултати",
              toc: "Съдържание",
              tocNoHeadings: "Няма заглавия",
              lastUpdate: "Последна промяна",
              chooseLanguage: "Изберете език",
              nextPage: "Следваща страница",
              previousPage: "Предишна страница",
              chooseTheme: "Изберете тема",
              editOnGithub: "Редактиране в GitHub",
            }
          : undefined
      }
    >
      {children}
    </I18nProvider>
  );
}
