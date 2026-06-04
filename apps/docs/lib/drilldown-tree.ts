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
