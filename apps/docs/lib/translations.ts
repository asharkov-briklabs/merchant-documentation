const translations = {
  // Top nav (site-nav.tsx, category-menu.tsx)
  askAi: "Ask AI",
  signIn: "Sign in",
  help: "Help",
  apiReference: "API Reference",
  searchPlaceholder: "Search documentation...",
  navViewAll: "View all docs",
  navMenu: "Menu",

  // Hero (page.tsx)
  heroEyebrow: "Multi-rail payment infrastructure",
  heroTitleLine1: "Build payments",
  heroTitleLine2: "that work",
  heroTitleAccent: "everywhere.",
  heroSubtitle:
    "Cards, bank transfers, stablecoins, and local methods — all through one API. Accept payments, manage operations, and go live.",
  getStartedCta: "Get started →",
  payments: "Payments",
  browseByProduct: "Browse by product",

  // Footer (site-footer.tsx)
  documentation: "Documentation",
  resources: "Resources",
  company: "Company",
  quickStart: "Quick Start",
  webhooks: "Webhooks",
  aiAssistant: "AI Assistant",
  troubleshooting: "Troubleshooting",
  footerTagline: "Multi-rail payment infrastructure for modern businesses.",
  footerCopy: "© 2026 VINR. All rights reserved.",
  complianceBadge1: "PCI DSS L1",
  complianceBadge2: "SOC 2 Type II",
  complianceBadge3: "GDPR",

  // Ask page (ask-client.tsx)
  askTitle: "Ask a question",
  askSubtitle:
    "AI-powered assistant trained on VINR documentation. Ask about integration, payments, compliance, or operations.",
  askPlaceholder: "Ask a question about VINR...",
  askDisclaimer:
    "AI responses are generated from VINR documentation. Verify critical information before production use.",
  askSuggestion1: "How do I integrate VINR payments?",
  askSuggestion2: "What payment methods are supported?",
  askSuggestion3: "How does settlement work?",
  askSuggestion4: "What are the compliance requirements?",

  // Announcement banner (announcement-banner.tsx)
  bannerText: "New: Stablecoin payouts are now live.",
  bannerCta: "Read the announcement",

  // Code snippet (code-card.tsx) — tab labels accessed dynamically via t[labelKey]
  codeTabPayment: "Create payment",
  codeTabPoints: "Issue points",
  codeTabReward: "Redeem reward",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const;

export type Translations = typeof translations;

export function getTranslations() {
  return translations;
}
