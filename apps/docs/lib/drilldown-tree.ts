import type * as PageTree from "fumadocs-core/page-tree";

/**
 * Extracts the first path segment under /docs from a pathname.
 * "/docs/payments/payment-operations/refund" → "payments"
 * "/docs" or "/" → null (no drill-in at the root)
 */
export function getSectionSlug(pathname: string): string | null {
  const match = pathname.match(/^\/docs\/([^/]+)/);
  return match?.[1] ?? null;
}

/**
 * Returns a new root whose children are scoped to the given folder's content.
 * Non-mutating — source.pageTree is built once at module load and shared
 * across requests (same rule as decorateEnterpriseTree).
 */
export function scopeTreeToSection(
  tree: PageTree.Root,
  folder: PageTree.Folder,
): PageTree.Root {
  return { ...tree, children: folder.children };
}

/**
 * Return a new tree with the folder at `folderRef` (the `$ref.folder` path,
 * e.g. "payments/payment-methods") flattened — its children are inlined
 * directly into the parent instead of wrapped in a folder group. Use when a
 * meta.json separator already labels the section and the folder's own group
 * label would be redundant.
 */
export function flattenFolderByRef(
  tree: PageTree.Root,
  folderRef: string,
): PageTree.Root {
  return { ...tree, children: _flattenNodes(tree.children, folderRef) };
}

function _flattenNodes(
  nodes: PageTree.Node[],
  folderRef: string,
): PageTree.Node[] {
  const out: PageTree.Node[] = [];
  for (const node of nodes) {
    if (node.type === "folder") {
      if (node.$ref?.folder === folderRef) {
        out.push(...node.children);
      } else {
        out.push({ ...node, children: _flattenNodes(node.children, folderRef) });
      }
    } else {
      out.push(node);
    }
  }
  return out;
}
