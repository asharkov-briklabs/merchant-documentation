/**
 * Source of truth for the marketing-nav mega-menu (Stripe/Adyen-style):
 * descriptive top-level categories, each opening a dropdown of that area's
 * key sub-pages. Labels are stored inline per-locale here (rather than in
 * lib/translations.ts) to keep the large page list self-contained.
 */
export interface NavLink {
  path: string;
  en: string;
  bg: string;
}

export interface NavGroup {
  /** Section overview the category links to. */
  path: string;
  en: string;
  bg: string;
  items: NavLink[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    path: "/docs/getting-started",
    en: "Get started",
    bg: "Първи стъпки",
    items: [
      { path: "/docs/getting-started", en: "Overview", bg: "Преглед" },
      { path: "/docs/getting-started/quick-start", en: "Quick start", bg: "Бърз старт" },
      { path: "/docs/getting-started/authentication", en: "Authentication", bg: "Автентикация" },
      { path: "/docs/getting-started/test-mode", en: "Test mode", bg: "Тестов режим" },
      { path: "/docs/getting-started/sdks", en: "SDKs", bg: "SDK-та" },
      { path: "/docs/getting-started/go-live-checklist", en: "Go-live checklist", bg: "Чеклист за старт" },
    ],
  },
  {
    path: "/docs/payments",
    en: "Payments",
    bg: "Плащания",
    items: [
      { path: "/docs/payments", en: "Overview", bg: "Преглед" },
      { path: "/docs/payments/payment-methods", en: "Payment methods", bg: "Методи за плащане" },
      { path: "/docs/payments/payment-lifecycle", en: "Payment lifecycle", bg: "Жизнен цикъл" },
      { path: "/docs/payments/refunds", en: "Refunds", bg: "Възстановявания" },
      { path: "/docs/payments/disputes", en: "Disputes", bg: "Спорове" },
      { path: "/docs/payments/recurring-payments", en: "Recurring payments", bg: "Повтарящи се плащания" },
    ],
  },
  {
    path: "/docs/billing",
    en: "Billing",
    bg: "Фактуриране",
    items: [
      { path: "/docs/billing", en: "Overview", bg: "Преглед" },
      { path: "/docs/billing/subscriptions", en: "Subscriptions", bg: "Абонаменти" },
      { path: "/docs/billing/invoices", en: "Invoices", bg: "Фактури" },
      { path: "/docs/billing/usage-based-billing", en: "Usage-based billing", bg: "Фактуриране по потребление" },
      { path: "/docs/billing/quotes", en: "Quotes", bg: "Оферти" },
      { path: "/docs/billing/tax", en: "Tax", bg: "Данъци" },
    ],
  },
  {
    path: "/docs/engagement",
    en: "Engagement",
    bg: "Ангажиране",
    items: [
      { path: "/docs/engagement", en: "Overview", bg: "Преглед" },
      { path: "/docs/engagement/loyalty-accounts", en: "Loyalty accounts", bg: "Лоялни акаунти" },
      { path: "/docs/engagement/earning-rules", en: "Earning rules", bg: "Правила за начисляване" },
      { path: "/docs/engagement/rewards-catalog", en: "Rewards catalog", bg: "Каталог с награди" },
      { path: "/docs/engagement/campaigns", en: "Campaigns", bg: "Кампании" },
      { path: "/docs/engagement/referrals", en: "Referrals", bg: "Препоръки" },
    ],
  },
  {
    path: "/docs/operations",
    en: "Operations",
    bg: "Операции",
    items: [
      { path: "/docs/operations", en: "Overview", bg: "Преглед" },
      { path: "/docs/operations/settlement", en: "Settlement", bg: "Сетълмент" },
      { path: "/docs/operations/payouts", en: "Payouts", bg: "Изплащания" },
      { path: "/docs/operations/reconciliation", en: "Reconciliation", bg: "Рекончилиация" },
      { path: "/docs/operations/reporting", en: "Reporting", bg: "Отчети" },
      { path: "/docs/compliance", en: "Compliance", bg: "Съответствие" },
    ],
  },
  {
    path: "/docs/api-reference",
    en: "Developer resources",
    bg: "Ресурси за разработчици",
    items: [
      { path: "/docs/api-reference", en: "API reference", bg: "API справка" },
      { path: "/docs/integration", en: "Integration", bg: "Интеграция" },
      { path: "/docs/integration/webhooks", en: "Webhooks", bg: "Уебхукове" },
      { path: "/docs/guides", en: "Guides", bg: "Ръководства" },
      { path: "/docs/changelog", en: "Changelog", bg: "Промени" },
      { path: "/docs/troubleshooting", en: "Troubleshooting", bg: "Отстраняване на проблеми" },
    ],
  },
];

export function navLabel(item: { en: string; bg: string }, locale: string): string {
  return locale === "bg" ? item.bg : item.en;
}
