import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { getTranslations } from "@/lib/translations";
import { decorateEnterpriseTree } from "@/lib/enterprise-nav";
import { SiteNav } from "../components/site-nav";
import { SidebarBridgeProvider, SidebarBridgeSetter } from "../components/sidebar-bridge";

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
        searchToggle={{ enabled: false }}
        sidebar={{ collapsible: false }}
      >
        <SidebarBridgeSetter />
        {children}
      </DocsLayout>
    </SidebarBridgeProvider>
  );
}
