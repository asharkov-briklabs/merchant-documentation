import type { getTranslations } from "./translations";

/**
 * Source of truth for the marketing-nav mega-menu. Groups the docs roots
 * (see content/docs/meta.json separators) into four dropdowns. Labels are
 * stored as translation keys so the menu stays i18n'd; reuse existing keys
 * from lib/translations.ts where a product label already exists.
 */
type TransKey = keyof ReturnType<typeof getTranslations>;

export interface NavItem {
  path: string;
  labelKey: TransKey;
  descKey: TransKey;
}

export interface NavGroup {
  titleKey: TransKey;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    titleKey: "navProducts",
    items: [
      { path: "/docs/payments", labelKey: "paymentsTitle", descKey: "paymentsDesc" },
      { path: "/docs/billing", labelKey: "billing", descKey: "billingDesc" },
      { path: "/docs/engagement", labelKey: "engagement", descKey: "engagementDesc" },
    ],
  },
  {
    titleKey: "navBuild",
    items: [
      { path: "/docs/getting-started", labelKey: "gettingStarted", descKey: "gettingStartedDesc" },
      { path: "/docs/guides", labelKey: "guides", descKey: "guidesDesc" },
      { path: "/docs/integration", labelKey: "integration", descKey: "integrationDesc" },
    ],
  },
  {
    titleKey: "navOperate",
    items: [
      { path: "/docs/operations", labelKey: "operations", descKey: "operationsDesc" },
      { path: "/docs/compliance", labelKey: "compliance", descKey: "complianceDesc" },
    ],
  },
  {
    titleKey: "navReference",
    items: [
      { path: "/docs/api-reference", labelKey: "apiReferenceTitle", descKey: "apiReferenceDesc" },
      { path: "/docs/troubleshooting", labelKey: "troubleshootingTitle", descKey: "troubleshootingDesc" },
      { path: "/docs/changelog", labelKey: "changelog", descKey: "changelogDesc" },
    ],
  },
];
