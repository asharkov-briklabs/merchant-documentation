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
  description?: string;
  icon?: string;
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
      { path: "/docs/payments/in-person", label: "In-person payments" },
      { path: "/docs/payments/in-person/terminals", label: "Terminal hardware" },
      { path: "/docs/payments/in-person/tap-to-pay", label: "Tap to Pay" },
      { path: "/docs/payments/omnichannel", label: "Unified commerce" },
      { path: "/docs/payments/omnichannel/click-and-collect", label: "Click & collect" },
      { path: "/docs/payments/omnichannel/cross-channel-loyalty", label: "Cross-channel loyalty" },
      { path: "/docs/payments/plugins", label: "Plugins" },
      { path: "/docs/payments/plugins/woocommerce", label: "WooCommerce" },
      { path: "/docs/payments/plugins/adobe-commerce", label: "Adobe Commerce" },
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
      {
        path: "/docs/operations/account-management",
        label: "Account & users",
        description: "Account structure, team users, SSO, and balances",
        icon: "Users",
      },
      {
        path: "/docs/operations/payouts",
        label: "Payouts",
        description: "Bank, card, and internal fund transfers",
        icon: "ArrowUpRight",
      },
      {
        path: "/docs/operations/reporting",
        label: "Reporting",
        description: "Financial and operational report exports",
        icon: "FileBarChart2",
      },
      {
        path: "/docs/operations/reconciliation",
        label: "Reconciliation",
        description: "Settlement and invoice reconciliation",
        icon: "BookCheck",
      },
      {
        path: "/docs/operations/risk-management",
        label: "Risk & fraud",
        description: "Risk rules, profiles, and fraud prevention",
        icon: "ShieldAlert",
      },
      {
        path: "/docs/operations/disputes",
        label: "Disputes",
        description: "Chargebacks, defense requirements, case management",
        icon: "MessageSquareWarning",
      },
      {
        path: "/docs/operations/optimization",
        label: "Optimization",
        description: "Uplift: conversion, routing, and authentication",
        icon: "TrendingUp",
      },
      {
        path: "/docs/operations/monitoring-and-alerts",
        label: "Monitoring",
        description: "Alerts, dashboards, and performance tracking",
        icon: "Activity",
      },
    ],
  },
  {
    path: "/docs/industries-and-markets",
    label: "Industries and markets",
    items: [
      {
        path: "/docs/industries-and-markets/industries",
        label: "Industries",
        description: "See what features we recommend for your industry.",
        icon: "LayoutGrid",
      },
      {
        path: "/docs/industries-and-markets/markets",
        label: "Markets",
        description: "Dive into guides for specific geographic markets.",
        icon: "Store",
      },
      {
        path: "/docs/industries-and-markets/peak-season",
        label: "Peak season readiness",
        description: "Prepare for the busiest sales period of the year.",
        icon: "TrendingUp",
      },
      {
        path: "/docs/industries-and-markets/major-sports-event",
        label: "Major sports events",
        description: "Handle high-volume in-person payments at live events.",
        icon: "Trophy",
      },
    ],
  },
  {
    path: "/docs/platforms",
    label: "Platforms",
    items: [
      {
        path: "/docs/platforms",
        label: "Overview",
        description: "Marketplace and platform payments on VINR",
        icon: "Layers",
      },
      {
        path: "/docs/platforms/platform-models",
        label: "Platform models",
        description: "SaaS, marketplace, and PayFac models compared",
        icon: "GitBranch",
      },
      {
        path: "/docs/platforms/onboarding",
        label: "Sub-merchant onboarding",
        description: "Hosted, embedded, and API-driven onboarding flows",
        icon: "UserPlus",
      },
      {
        path: "/docs/platforms/verification",
        label: "Verification & KYC/KYB",
        description: "Identity, UBO, document requirements by country",
        icon: "BadgeCheck",
      },
      {
        path: "/docs/platforms/split-payments",
        label: "Split payments",
        description: "Route a charge across multiple sub-merchants",
        icon: "ArrowLeftRight",
      },
      {
        path: "/docs/platforms/fund-management",
        label: "Fund management",
        description: "Balance accounts, reserves, internal transfers",
        icon: "Wallet",
      },
      {
        path: "/docs/platforms/payouts",
        label: "Payouts",
        description: "Schedules, instant payouts, cross-border",
        icon: "ArrowUpRight",
      },
      {
        path: "/docs/platforms/platform-controls",
        label: "Platform controls",
        description: "Capabilities, risk rules, and spending limits",
        icon: "SlidersHorizontal",
      },
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
