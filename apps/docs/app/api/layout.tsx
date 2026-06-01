import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { getTranslations } from "@/lib/translations";
import { apiSource } from "@/lib/api-source";
import { SiteNav } from "../components/site-nav";
import { SidebarBridgeProvider, SidebarBridgeSetter } from "../components/sidebar-bridge";

export default function ApiLayout({ children }: { children: ReactNode }) {
  const t = getTranslations();
  return (
    <SidebarBridgeProvider>
      <SiteNav t={t} fluid />
      <DocsLayout
        tree={apiSource.pageTree}
        nav={{ enabled: false }}
      >
        <SidebarBridgeSetter />
        {children}
      </DocsLayout>
    </SidebarBridgeProvider>
  );
}
