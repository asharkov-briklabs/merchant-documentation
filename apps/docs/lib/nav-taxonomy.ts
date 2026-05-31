/**
 * Source of truth for the marketing-nav mega-menu (Stripe/Adyen-style):
 * descriptive top-level categories, each opening a dropdown of that area's
 * key sub-pages.
 *
 * NOTE: this list is maintained by hand alongside the sidebar `ROOTS`
 * (app/docs/layout.tsx) and `CategoryEnum` (lib/schema.ts). See the
 * taxonomy-consolidation work in the remediation plan for folding these into a
 * single registry.
 */
export interface NavLink {
  path: string;
  label: string;
}

export interface NavGroup {
  /** Section overview the category links to. */
  path: string;
  label: string;
  items: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    path: "/docs/getting-started",
    label: "Get started",
    items: [
      { path: "/docs/getting-started", label: "Overview" },
      { path: "/docs/getting-started/quick-start", label: "Quick start" },
      { path: "/docs/getting-started/authentication", label: "Authentication" },
      { path: "/docs/getting-started/test-mode", label: "Test mode" },
      { path: "/docs/getting-started/sdks", label: "SDKs" },
      { path: "/docs/getting-started/go-live-checklist", label: "Go-live checklist" },
    ],
  },
  {
    path: "/docs/payments",
    label: "Payments",
    items: [
      { path: "/docs/payments", label: "Overview" },
      { path: "/docs/payments/payment-methods", label: "Payment methods" },
      { path: "/docs/payments/payment-lifecycle", label: "Payment lifecycle" },
      { path: "/docs/payments/refunds", label: "Refunds" },
      { path: "/docs/payments/disputes", label: "Disputes" },
      { path: "/docs/payments/recurring-payments", label: "Recurring payments" },
    ],
  },
  {
    path: "/docs/billing",
    label: "Billing",
    items: [
      { path: "/docs/billing", label: "Overview" },
      { path: "/docs/billing/subscriptions", label: "Subscriptions" },
      { path: "/docs/billing/invoices", label: "Invoices" },
      { path: "/docs/billing/usage-based-billing", label: "Usage-based billing" },
      { path: "/docs/billing/quotes", label: "Quotes" },
      { path: "/docs/billing/tax", label: "Tax" },
    ],
  },
  {
    path: "/docs/engagement",
    label: "Engagement",
    items: [
      { path: "/docs/engagement", label: "Overview" },
      { path: "/docs/engagement/loyalty-accounts", label: "Loyalty accounts" },
      { path: "/docs/engagement/earning-rules", label: "Earning rules" },
      { path: "/docs/engagement/rewards-catalog", label: "Rewards catalog" },
      { path: "/docs/engagement/campaigns", label: "Campaigns" },
      { path: "/docs/engagement/referrals", label: "Referrals" },
    ],
  },
  {
    path: "/docs/operations",
    label: "Operations",
    items: [
      { path: "/docs/operations", label: "Overview" },
      { path: "/docs/operations/settlement", label: "Settlement" },
      { path: "/docs/operations/payouts", label: "Payouts" },
      { path: "/docs/operations/reconciliation", label: "Reconciliation" },
      { path: "/docs/operations/reporting", label: "Reporting" },
      { path: "/docs/compliance", label: "Compliance" },
    ],
  },
  {
    path: "/api-reference",
    label: "Developer resources",
    items: [
      { path: "/api-reference", label: "API reference" },
      { path: "/docs/integration", label: "Integration" },
      { path: "/docs/integration/webhooks", label: "Webhooks" },
      { path: "/docs/guides", label: "Guides" },
      { path: "/docs/changelog", label: "Changelog" },
      { path: "/docs/troubleshooting", label: "Troubleshooting" },
    ],
  },
];
