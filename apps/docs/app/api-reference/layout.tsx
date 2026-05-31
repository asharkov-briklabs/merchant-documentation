import type { ReactNode } from "react";
import { source } from "@/lib/source";
import apiMeta from "@/content/docs/api-reference/meta.json";
import { ApiRefProvider } from "./_components/api-ref-context";
import { ApiNavProvider, ApiSidebar, type ApiNavNode } from "./_components/api-sidebar";
import { ApiTopBar } from "./_components/api-top-bar";
import { ApiCodeRail } from "./_components/api-code-rail";

/**
 * Dedicated full-screen API-reference shell (modeled on docs.stripe.com/api):
 * a dark top bar, a left endpoint nav, the prose center column, and a sticky
 * right code rail — distinct from the marketing/docs DocsLayout chrome.
 *
 * The left nav is projected from the same content/docs/api-reference/meta.json
 * that fumadocs already uses, so the ordering and section headers stay in sync
 * with the source of truth (no second hand-maintained list).
 */

const SECTION_RE = /^---(.*)---$/;

function buildNav(): ApiNavNode[] {
  const nodes: ApiNavNode[] = [];
  for (const entry of apiMeta.pages as string[]) {
    const section = entry.match(SECTION_RE);
    if (section) {
      nodes.push({ type: "section", label: section[1].trim() });
      continue;
    }
    const slug = entry === "index" ? [] : [entry];
    const page = source.getPage(["api-reference", ...slug]);
    nodes.push({
      type: "link",
      title: page?.data.title ?? prettify(entry),
      url: entry === "index" ? "/api-reference" : `/api-reference/${entry}`,
    });
  }
  return nodes;
}

function prettify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

export default function ApiReferenceLayout({ children }: { children: ReactNode }) {
  const nav = buildNav();

  return (
    <ApiRefProvider>
      <ApiNavProvider>
        <div className="dark min-h-dvh bg-vinr-900 text-vinr-50">
          <ApiTopBar />
          <div className="mx-auto flex w-full max-w-[1680px]">
            <ApiSidebar nav={nav} />
            <div className="flex min-w-0 flex-1">
              <main className="min-w-0 flex-1 px-5 py-8 md:px-10">{children}</main>
              <aside className="hidden w-[400px] shrink-0 lg:block xl:w-[440px]">
                <ApiCodeRail />
              </aside>
            </div>
          </div>
        </div>
      </ApiNavProvider>
    </ApiRefProvider>
  );
}
