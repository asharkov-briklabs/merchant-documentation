// UI string table. Currently English-only — the Bulgarian (`bg`) block was
// removed alongside the locale (see lib/i18n.ts); restore it from git history
// when Bulgarian content ships. `getTranslations` falls back to `en` for any
// unknown locale, so adding a locale here is the single switch to flip.
const translations = {
  en: {
    // Navbar
    docs: "Docs",
    api: "API",
    askAi: "Ask AI",
    signIn: "Sign in",
    help: "Help",

    // Hero
    heroTitle: "Documentation",
    heroEyebrow: "Multi-rail payment infrastructure",
    heroTitleLine1: "Build payments",
    heroTitleLine2: "that work",
    heroTitleAccent: "everywhere.",
    heroSubtitle:
      "Cards, bank transfers, stablecoins, and local methods — all through one API. Accept payments, manage operations, and go live.",
    getStarted: "Get started →",
    getStartedCta: "Get started →",
    apiReference: "API Reference",
    payments: "Payments",
    searchPlaceholder: "Search documentation...",

    // Use cases
    useCasesEyebrow: "Use cases",
    useCasesTitle: "What do you want to build?",
    useCasePayments: "Payments",
    useCaseIntegration: "Integration",
    useCaseDevelopers: "Developers",
    acceptOnlinePayments: "Accept online payments",
    paymentMethodsRails: "Payment methods & rails",
    settlementPayouts: "Settlement & payouts",
    quickStartGuide: "Quick start guide",
    authenticationKeys: "Authentication & keys",
    webhooksEvents: "Webhooks & events",
    fullApiReference: "Full API Reference",
    sdksLibraries: "SDKs & libraries",
    troubleshooting: "Troubleshooting",

    // Products
    productsEyebrow: "Documentation",
    browseByProduct: "Browse by product",
    gettingStarted: "Getting Started",
    gettingStartedDesc: "Account setup, first API call, and sandbox.",
    paymentsTitle: "Payments",
    paymentsDesc: "Methods, lifecycle, and checkout flows.",
    integration: "Integration",
    integrationDesc: "SDKs, webhooks, and hosted checkout.",
    operations: "Operations",
    operationsDesc: "Settlement, reconciliation, and alerts.",
    compliance: "Compliance",
    complianceDesc: "PCI DSS, KYC/AML, and GDPR.",
    apiReferenceTitle: "API Reference",
    apiReferenceDesc: "Endpoints, schemas, and examples.",
    troubleshootingTitle: "Troubleshooting",
    troubleshootingDesc: "Error codes and debugging guides.",

    // Dev resources
    devResEyebrow: "Developer resources",
    devResTitle: "Tools & shortcuts",
    developerResources: "Developer resources",
    apiExplorer: "API Explorer",
    apiExplorerDesc: "Interactive endpoint reference with live requests.",
    webhooks: "Webhooks",
    webhooksDesc: "Real-time event notifications for payments and disputes.",
    quickStart: "Quick Start",
    quickStartDesc: "Make your first API call and process a test payment.",
    aiAssistant: "AI Assistant",
    aiAssistantDesc: "Get instant answers from the entire VINR documentation.",

    // Footer
    documentation: "Documentation",
    resources: "Resources",
    company: "Company",
    footerTagline: "Multi-rail payment infrastructure for modern businesses.",
    footerCopy: "© 2026 VINR. All rights reserved.",
    complianceBadge1: "PCI DSS L1",
    complianceBadge2: "SOC 2 Type II",
    complianceBadge3: "GDPR",
    backToDocs: "Back to Docs",

    // Ask page
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

    // Nav mega-menu
    navViewAll: "View all docs",
    navMenu: "Menu",
    billing: "Billing",
    billingDesc: "Subscriptions, invoicing, and usage.",
    engagement: "Engagement",
    engagementDesc: "Loyalty, rewards, and campaigns.",
    guides: "Guides",
    guidesDesc: "End-to-end recipes by product.",
    changelog: "Changelog",
    changelogDesc: "API and product changes.",

    // Announcement banner
    bannerText: "New: Stablecoin payouts are now live.",
    bannerCta: "Read the announcement",

    // Code snippet
    codeComment: "// Redirect to checkout",
    codeTabPayment: "Create payment",
    codeTabPoints: "Issue points",
    codeTabReward: "Redeem reward",
    copyLabel: "Copy",
    copiedLabel: "Copied",
  },
} as const;

export type Locale = keyof typeof translations;

export function getTranslations(locale: string) {
  return translations[locale as Locale] ?? translations.en;
}
