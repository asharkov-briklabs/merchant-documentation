import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { icons } from "lucide-react";
import { createElement } from "react";
import { getTranslations } from "@/lib/translations";
import { CATEGORIES } from "@/lib/taxonomy";
import { decorateEnterpriseTree } from "@/lib/enterprise-nav";
import { SiteNav } from "../components/site-nav";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";

// Product switcher (Stripe-style): one entry per doc category. Projected from
// the single taxonomy registry (lib/taxonomy.ts) so titles/icons stay in sync
// with the search facet and never drift.
const TABS: LayoutTab[] = CATEGORIES
  // The API reference lives on its own dedicated screen (/api-reference),
  // not inside the docs DocsLayout, so it's excluded from the product switcher.
  .filter((c) => c.slug !== "api-reference")
  .map((c) => ({
    url: `/docs/${c.slug}`,
    title: c.label,
    description: c.description,
    icon: createElement(icons[c.icon as keyof typeof icons]),
  }));

export default function Layout({ children }: { children: ReactNode }) {
  const t = getTranslations();

  // Badge wholly-enterprise pages (frontmatter `enterprise: true`) in the
  // sidebar — see notes/standard-vs-advanced-modes.md.
  const enterpriseUrls = new Set(
    source
      .getPages()
      .filter((p) => p.data.enterprise)
      .map((p) => p.url),
  );
  const tree = decorateEnterpriseTree(source.pageTree, enterpriseUrls);

  return (
    <DocsLayout
      tree={tree}
      tabs={TABS}
      nav={{
        // Replace fumadocs' built-in navbar with our marketing SiteNav so the
        // Stripe-style two-row top nav shows on every docs page.
        component: <SiteNav t={t} fluid />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
