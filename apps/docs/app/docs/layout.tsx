import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { icons } from "lucide-react";
import { createElement } from "react";
import { getTranslations } from "@/lib/translations";
import { CATEGORIES } from "@/lib/taxonomy";
import { decorateEnterpriseTree } from "@/lib/enterprise-nav";
import { SiteNav } from "../components/site-nav";
import { SidebarBridgeProvider, SidebarBridgeSetter } from "../components/sidebar-bridge";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";
import { ProductSwitcher } from "./components/product-switcher";

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

  const enterpriseUrls = new Set(
    source
      .getPages()
      .filter((p) => p.data.enterprise)
      .map((p) => p.url),
  );
  const tree = decorateEnterpriseTree(source.pageTree, enterpriseUrls);

  return (
    <SidebarBridgeProvider>
      <SiteNav t={t} fluid />
      <DocsLayout
        tree={tree}
        tabs={false}
        nav={{ enabled: false }}
        sidebar={{
          banner: <ProductSwitcher tabs={TABS} />,
        }}
      >
        <SidebarBridgeSetter />
        {children}
      </DocsLayout>
    </SidebarBridgeProvider>
  );
}
