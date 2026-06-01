import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { getTranslations } from "@/lib/translations";
import { apiSource } from "@/lib/api-source";
import { SiteNav } from "../components/site-nav";

export default function ApiLayout({ children }: { children: ReactNode }) {
  const t = getTranslations();
  return (
    <DocsLayout
      tree={apiSource.pageTree}
      nav={{
        component: <SiteNav t={t} fluid />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
