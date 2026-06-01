import * as PageTree from "fumadocs-core/page-tree";
import type { ReactNode } from "react";

/**
 * Sidebar "Enterprise" badge for wholly-enterprise pages (frontmatter
 * `enterprise: true`). The second mechanism of the Standard/Advanced content
 * model — see notes/standard-vs-advanced-modes.md. We badge, never hide: the
 * page stays reachable and indexable for everyone; the tag just signals who
 * it's for.
 */
export function EnterpriseBadge() {
  return (
    <span
      className="ms-2 rounded border border-fd-primary/30 px-1 py-px text-[10px] font-medium uppercase leading-none tracking-wide text-fd-primary"
      title="Enterprise feature"
    >
      Enterprise
    </span>
  );
}

function withBadge(name: ReactNode): ReactNode {
  return (
    <span className="inline-flex items-center">
      {name}
      <EnterpriseBadge />
    </span>
  );
}

/**
 * Return a NEW page tree (no mutation of the shared `source.pageTree`) with an
 * Enterprise badge appended to the name of every page item whose URL is in
 * `enterpriseUrls`. Folders are badged when their index page is enterprise.
 *
 * Non-mutating on purpose: `source.pageTree[locale]` is built once at module
 * load and shared across requests, so mutating it would double-append badges
 * over the life of the process.
 */
export function decorateEnterpriseTree(
  tree: PageTree.Root,
  enterpriseUrls: Set<string>,
): PageTree.Root {
  return { ...tree, children: tree.children.map((n) => decorateNode(n, enterpriseUrls)) };
}

function decorateNode(node: PageTree.Node, urls: Set<string>): PageTree.Node {
  if (node.type === "page") {
    return urls.has(node.url) ? { ...node, name: withBadge(node.name) } : node;
  }
  if (node.type === "folder") {
    const indexIsEnterprise = node.index && urls.has(node.index.url);
    return {
      ...node,
      name: indexIsEnterprise ? withBadge(node.name) : node.name,
      children: node.children.map((c) => decorateNode(c, urls)),
    };
  }
  return node; // separator
}
