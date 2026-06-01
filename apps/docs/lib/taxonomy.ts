import { CategoryEnum, type Category } from "@/lib/schema";

/**
 * Single registry for the doc categories. Everything per-category — the search
 * facet labels, the sidebar product switcher (`ROOTS` in the docs layout), and
 * any future category UI — is a projection of this list, so labels/icons can't
 * drift apart (the bug that desynced CATEGORY_LABELS in a past merge).
 *
 * `icon` is a lucide-react icon name, resolved to a component where rendered
 * (server-safe: this module only stores the name string).
 *
 * NOTE: the marketing mega-menu (lib/nav-taxonomy.ts) and the homepage product
 * grid are intentionally *curated* views (hand-picked sub-links / copy), not
 * 1:1 projections of this registry.
 */
export interface CategoryMeta {
  slug: Category;
  label: string;
  description: string;
  /** lucide-react icon name. */
  icon: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "getting-started", label: "Getting started", description: "Set up and make your first call", icon: "Rocket" },
  { slug: "guides", label: "Guides", description: "End-to-end recipes by product", icon: "BookOpen" },
  { slug: "payments", label: "Payments", description: "Accept and process payments", icon: "CreditCard" },
  { slug: "billing", label: "Billing", description: "Subscriptions, invoicing, usage", icon: "ReceiptText" },
  { slug: "engagement", label: "Engagement", description: "Loyalty, rewards, campaigns", icon: "Gift" },
  { slug: "integration", label: "Integration", description: "Checkout, Elements, webhooks", icon: "Blocks" },
  { slug: "operations", label: "Operations", description: "Settlement, payouts, reporting", icon: "Activity" },
  { slug: "platforms", label: "Platforms", description: "Marketplaces, sub-merchant onboarding, split payments", icon: "Layers" },
  { slug: "industries-and-markets", label: "Industries and markets", description: "Industry guides and geographic market compliance", icon: "LayoutGrid" },
  { slug: "compliance", label: "Compliance", description: "PCI, KYC/AML, PSD2, GDPR", icon: "ShieldCheck" },
  { slug: "api-reference", label: "API reference", description: "Endpoints, objects, errors", icon: "Code" },
  { slug: "troubleshooting", label: "Troubleshooting", description: "Errors, declines, debugging", icon: "LifeBuoy" },
  { slug: "changelog", label: "Changelog", description: "API and product changes", icon: "History" },
];

// Compile-time guard: every CategoryEnum member must appear exactly once above.
// If the enum and the registry drift, this object literal fails to type-check.
const _exhaustive: Record<Category, true> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, true])
) as Record<Category, true>;
void _exhaustive;

export const CATEGORY_BY_SLUG: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<Category, CategoryMeta>;

/** Human-readable label per category. */
export const CATEGORY_LABELS: Record<Category, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.label])
) as Record<Category, string>;

/** Tag items consumed by the fumadocs search dialog for category filtering. */
export const CATEGORY_TAGS = CategoryEnum.options.map((value) => ({
  name: CATEGORY_LABELS[value],
  value,
}));
