import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layout";
import { RootToggle } from "fumadocs-ui/components/layout/root-toggle";
import type { ReactNode } from "react";
import { icons } from "lucide-react";
import { createElement } from "react";
import { getTranslations } from "@/lib/translations";
import { CATEGORIES } from "@/lib/taxonomy";
import { decorateEnterpriseTree } from "@/lib/enterprise-nav";
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
}[] = CATEGORIES
  // The API reference now lives on its own dedicated screen (/api-reference),
  // not inside the docs DocsLayout, so it's excluded from the product switcher.
  // The top nav and footer link to it directly.
  .filter((c) => c.slug !== "api-reference")
  .map((c) => ({
    path: `/docs/${c.slug}`,
    title: c.label,
    description: c.description,
    icon: createElement(icons[c.icon as keyof typeof icons]),
  }));

export default function Layout({ children }: { children: ReactNode }) {
  const t = getTranslations();

  // Badge wholly-enterprise pages (frontmatter `enterprise: true`) in the
  // sidebar — see notes/standard-vs-advanced-modes.md. Non-mutating: builds a
  // decorated copy of the shared page tree.
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
      nav={{
        // Replace fumadocs' built-in navbar with our marketing SiteNav so the
        // Stripe-style two-row top nav (search/Ask AI on top, category
        // dropdowns below) shows on every docs page. SiteNav is 100px tall;
        // globals.css shifts fumadocs' sidebar/TOC sticky offsets to match.
        component: <SiteNav t={t} fluid />,
      }}
      sidebar={{
        banner: (
          <RootToggle
            options={ROOTS.map((r) => ({
              url: r.path,
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
