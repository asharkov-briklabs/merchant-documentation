import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { getTranslations } from "@/lib/translations";
import { decorateEnterpriseTree } from "@/lib/enterprise-nav";
import { getSectionSlug, scopeTreeToSection, flattenFolderByRef } from "@/lib/drilldown-tree";
import { SiteNav } from "../components/site-nav";
import { SidebarBridgeProvider, SidebarBridgeSetter } from "../components/sidebar-bridge";
import { headers } from "next/headers";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type * as PageTree from "fumadocs-core/page-tree";

// ---------------------------------------------------------------------------
// Module-level: computed once at server startup, shared across all requests.
// The decorated tree and per-section scoped trees only change on deploy, so
// rebuilding them per-request is wasteful. This layout is forced dynamic by
// headers() (needed to read x-pathname for sidebar scoping — layouts cannot
// receive child-segment params in Next.js App Router). Hoisting here reduces
// per-request work to: headers() + Map.get().
// ---------------------------------------------------------------------------
const _enterpriseUrls = new Set(
  source.getPages().filter((p) => p.data.enterprise).map((p) => p.url),
);
const _decoratedTree = flattenFolderByRef(
  decorateEnterpriseTree(source.pageTree, _enterpriseUrls),
  "payments/payment-methods",
);

type SectionEntry = { folder: PageTree.Folder; tree: PageTree.Root };
const _sectionTrees = new Map<string, SectionEntry>();
for (const node of _decoratedTree.children) {
  if (node.type === "folder" && node.index?.url) {
    const slug = node.index.url.split("/")[2];
    if (slug) {
      _sectionTrees.set(slug, {
        folder: node as PageTree.Folder,
        tree: scopeTreeToSection(_decoratedTree, node as PageTree.Folder),
      });
    }
  }
}

export default async function Layout({ children }: { children: ReactNode }) {
  const t = getTranslations();
  const pathname = (await headers()).get("x-pathname") ?? "";

  const sectionSlug = getSectionSlug(pathname);
  const section = sectionSlug ? (_sectionTrees.get(sectionSlug) ?? null) : null;

  const sidebarBanner = section ? (
    <div className="px-2 pb-3">
      <Link
        href="/docs"
        className="flex items-center gap-1 text-xs text-fd-muted-foreground hover:text-fd-foreground transition-colors"
      >
        <ChevronLeft className="h-3 w-3 shrink-0" />
        All docs
      </Link>
      <p className="mt-3 px-1 text-sm font-semibold text-fd-foreground">{section.folder.name}</p>
    </div>
  ) : null;

  return (
    <SidebarBridgeProvider>
      <SiteNav t={t} />
      <DocsLayout
        tree={section?.tree ?? _decoratedTree}
        tabs={false}
        nav={{ enabled: false }}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
        sidebar={{ collapsible: false, banner: sidebarBanner }}
      >
        <SidebarBridgeSetter />
        {children}
      </DocsLayout>
    </SidebarBridgeProvider>
  );
}
