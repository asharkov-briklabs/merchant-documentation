import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layout";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import type { ReactNode } from "react";
import { icons } from "lucide-react";
import { createElement } from "react";
import { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";
import { CATEGORIES } from "@/lib/taxonomy";
import { SiteNav } from "../components/site-nav";

// Product switcher (Stripe-style): one entry per doc category. Projected from
// the single taxonomy registry (lib/taxonomy.ts) so titles/icons stay in sync
// with the search facet and never drift. The sidebar auto-scopes to the active
// root; this toggle lets users jump between them.
const ROOTS: {
  path: string;
  title: string;
  description: string;
  icon: ReactNode;
}[] = CATEGORIES.map((c) => ({
  path: `/docs/${c.slug}`,
  title: c.label,
  description: c.description,
  icon: createElement(icons[c.icon as keyof typeof icons]),
}));

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
        // Replace fumadocs' built-in navbar with our marketing SiteNav so the
        // Stripe-style two-row top nav (search/Ask AI on top, category
        // dropdowns below) shows on every docs page. SiteNav is 100px tall;
        // globals.css shifts fumadocs' sidebar/TOC sticky offsets to match.
        component: <SiteNav t={t} locale={params.locale} fluid />,
      }}
      sidebar={{
        banner: (
          <RootToggle
            options={ROOTS.map((r) => ({
              url: localeHref(params.locale, r.path),
              title: r.title,
              description: r.description,
              icon: r.icon,
            }))}
          />
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
