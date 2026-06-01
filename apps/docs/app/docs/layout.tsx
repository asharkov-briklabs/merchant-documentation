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
import { ProductSwitcher } from "./components/product-switcher";

// Product switcher entries — one per doc category (api-reference excluded; it
// lives on its own /api-reference screen with a separate layout).
const TABS: LayoutTab[] = CATEGORIES
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
      tabs={false}
      nav={{
        // Replace fumadocs' built-in navbar with our marketing SiteNav so the
        // Stripe-style two-row top nav shows on every docs page.
        component: <SiteNav t={t} fluid />,
      }}
      sidebar={{
        // The ProductSwitcher is a custom replacement for the removed
        // fumadocs v16 RootToggle — renders a compact dropdown at the top of
        // the sidebar rather than a top-of-page tab strip.
        banner: <ProductSwitcher tabs={TABS} />,
      }}
    >
      {children}
    </DocsLayout>
  );
}
