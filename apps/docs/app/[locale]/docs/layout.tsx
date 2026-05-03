import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layout";
import type { ReactNode } from "react";
import { VinrWordmark } from "../components/vinr-wordmark";
import { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";

export default function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);

  return (
    <DocsLayout
      tree={source.pageTree[params.locale]}
      nav={{
        title: <VinrWordmark height={18} fill="#0b3b45" />,
        url: localeHref(params.locale, "/"),
      }}
      links={[
        { text: t.docs, url: localeHref(params.locale, "/docs"), type: "main" },
        { text: t.api, url: localeHref(params.locale, "/docs/api-reference"), type: "main" },
        { text: t.askAi, url: localeHref(params.locale, "/ask"), type: "button" },
      ]}
      i18n
    >
      {children}
    </DocsLayout>
  );
}
