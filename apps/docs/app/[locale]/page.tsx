import Link from "next/link";
import { cookies } from "next/headers";
import { localeHref } from "@/lib/locale-href";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { HeroMeshBg } from "./components/hero-mesh-bg";
import { CodeCard } from "./components/code-card";
import { SearchTrigger } from "./components/search-trigger";
import { AnnouncementBanner, BANNER_COOKIE } from "./components/announcement-banner";
import { getTranslations } from "@/lib/translations";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { Category } from "@/lib/schema";

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);
  const h = (p: string) => localeHref(params.locale, p);
  const bannerDismissed =
    cookies().get(BANNER_COOKIE)?.value === "dismissed";

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "VINR",
            description:
              "Multi-rail payment infrastructure for modern businesses.",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://docs.vinr.com",
          }),
        }}
      />
      <AnnouncementBanner t={t} locale={params.locale} initiallyDismissed={bannerDismissed} />
      <SiteNav t={t} locale={params.locale} activeKey="docs" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06] bg-vinr-900 px-10 pb-20 pt-[72px]">
        <HeroMeshBg />
        <div className="relative z-[2] mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* Left column */}
          <div>
            {/* Eyebrow pill */}
            <div className="mb-5 inline-flex items-center gap-[7px] rounded-full border border-vinr-500/30 bg-vinr-500/15 px-2.5 py-1">
              <span className="h-[6px] w-[6px] rounded-full bg-vinr-500 shadow-[0_0_8px_rgba(42,157,144,0.7)]" />
              <span className="text-[11px] font-medium tracking-[0.02em] text-vinr-300">
                {t.heroEyebrow}
              </span>
            </div>

            <h1 className="mb-[18px] text-[52px] font-bold leading-[1.06] tracking-[-0.025em] text-vinr-50">
              {t.heroTitleLine1}
              <br />
              {t.heroTitleLine2} <span className="text-vinr-300">{t.heroTitleAccent}</span>
            </h1>

            <p className="mb-8 max-w-[460px] text-[17px] leading-[1.6] text-white/60">
              {t.heroSubtitle}
            </p>

            <div className="mb-7">
              <SearchTrigger placeholder={t.searchPlaceholder} variant="dark" />
            </div>

            <div className="flex items-center gap-5">
              <Link
                href={h("/docs/getting-started/quick-start")}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-vinr-500 px-5 text-sm font-medium text-white transition-colors hover:bg-vinr-600"
              >
                {t.getStartedCta}
              </Link>
              <Link
                href={h("/docs/api-reference")}
                className="text-sm font-medium text-white/50 transition-colors hover:text-vinr-50"
              >
                {t.apiReference}
              </Link>
              <span className="text-xs text-white/20">·</span>
              <Link
                href={h("/docs/payments")}
                className="text-sm font-medium text-white/50 transition-colors hover:text-vinr-50"
              >
                {t.payments}
              </Link>
            </div>
          </div>

          {/* Right column — Code card */}
          <div className="hidden md:block">
            <CodeCard t={t} />
          </div>
        </div>
      </section>

      {/* Documentation intro + quick links (Stripe-style) */}
      <section className="border-b border-zinc-200 bg-white px-10 pt-16 pb-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[32px] font-bold tracking-[-0.02em] text-vinr-700">Documentation</h2>
          <p className="mt-2 max-w-[560px] text-[17px] leading-[1.5] text-zinc-500">
            Explore our guides and examples to integrate VINR.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <Link
              href={h("/docs/getting-started/quick-start")}
              className="flex h-10 items-center gap-1.5 rounded-lg bg-vinr-700 px-5 text-sm font-medium text-white transition-colors hover:bg-vinr-800"
            >
              {t.getStartedCta}
            </Link>
            <a href="#browse-by-product" className="text-sm font-medium text-vinr-600 transition-colors hover:text-vinr-800">
              Explore all products →
            </a>
          </div>

          {/* Three-column quick links */}
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-3">
            {QUICK_LINKS.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-[15px] font-semibold text-vinr-700">{col.title}</div>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={h(link.href)}
                        className="text-[14px] text-vinr-600 transition-colors hover:text-vinr-800 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Try it out */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-10 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="mb-6 text-[22px] font-bold tracking-[-0.01em] text-vinr-700">Try it out</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr] md:gap-8">
            {/* Task list */}
            <ul className="flex flex-col gap-1 self-start rounded-xl border border-zinc-200 bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              {TRY_TASKS.map((task, i) => (
                <li key={task.label}>
                  <Link
                    href={h(task.href)}
                    className={[
                      "flex items-center justify-between rounded-lg px-3.5 py-2.5 text-[14px] transition-colors",
                      i === 0
                        ? "bg-vinr-100 font-medium text-vinr-700"
                        : "text-zinc-700 hover:bg-zinc-50 hover:text-vinr-700",
                    ].join(" ")}
                  >
                    {task.label}
                    <svg className="h-3.5 w-3.5 shrink-0 opacity-40" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            {/* Code card */}
            <div className="min-w-0">
              <CodeCard t={t} />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by product — Stripe-style buckets */}
      <section id="browse-by-product" className="border-b border-zinc-200 bg-white px-10 py-16 scroll-mt-[120px]">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="mb-9 text-[22px] font-bold tracking-[-0.01em] text-vinr-700">{t.browseByProduct}</h2>
          <div className="flex flex-col gap-12">
            {PRODUCT_BUCKETS.map((bucket) => (
              <div key={bucket.group}>
                <div className="mb-5 border-b border-zinc-200 pb-2.5 text-[13px] text-zinc-500">{bucket.group}</div>
                <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                  {bucket.slugs.map((slug) => {
                    const c = CATEGORY_BY_SLUG[slug];
                    return (
                      <Link key={slug} href={h(`/docs/${slug}`)} className="group block">
                        <div className="text-[15px] font-semibold text-vinr-600 transition-colors group-hover:text-vinr-800 group-hover:underline">
                          {c.label}
                        </div>
                        <div className="mt-1 text-[13px] leading-[1.5] text-zinc-600">{c.description}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Help links */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-10 py-12">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3.5">
          {HELP_LINKS.map((item) => (
            <div key={item.text} className="flex items-center gap-2.5 text-[14px] text-zinc-600">
              <span className="text-vinr-400">{item.icon}</span>
              {item.text}{" "}
              <Link href={h(item.href)} className="font-medium text-vinr-600 transition-colors hover:text-vinr-800 hover:underline">
                {item.linkText}
              </Link>
              .
            </div>
          ))}
        </div>
      </section>

      <SiteFooter t={t} locale={params.locale} />
    </main>
  );
}

/* --- Home content (curated marketing views; English-only like the rest of the
   page — see lib/translations.ts) --- */

const QUICK_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Payments",
    links: [
      { label: "Accept payments online", href: "/docs/payments" },
      { label: "Payment methods & rails", href: "/docs/payments/payment-methods" },
      { label: "Accept payments in-person", href: "/docs/payments" },
    ],
  },
  {
    title: "Revenue",
    links: [
      { label: "Sell subscriptions", href: "/docs/billing/subscriptions" },
      { label: "Offer usage-based pricing", href: "/docs/billing/usage-based-billing" },
      { label: "Loyalty & rewards", href: "/docs/engagement" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Set up your environment", href: "/docs/getting-started/quick-start" },
      { label: "Full API reference", href: "/docs/api-reference" },
      { label: "Webhooks & events", href: "/docs/integration/webhooks" },
    ],
  },
];

const TRY_TASKS: { label: string; href: string }[] = [
  { label: "Accept a payment", href: "/docs/guides/accept-a-payment" },
  { label: "Create a subscription", href: "/docs/billing/subscriptions/creating-subscriptions" },
  { label: "Send an invoice", href: "/docs/guides/send-an-invoice" },
  { label: "Save & reuse cards", href: "/docs/guides/save-and-reuse-cards" },
  { label: "Earn loyalty at checkout", href: "/docs/guides/earn-loyalty-at-checkout" },
  { label: "Reconcile settlements", href: "/docs/guides/reconcile-settlements" },
];

const PRODUCT_BUCKETS: { group: string; slugs: Category[] }[] = [
  { group: "Payments", slugs: ["payments", "integration", "compliance"] },
  { group: "Revenue", slugs: ["billing", "engagement"] },
  { group: "Money management", slugs: ["operations"] },
  { group: "Developer tools", slugs: ["getting-started", "api-reference", "guides", "troubleshooting", "changelog"] },
];

const HELP_LINKS: { icon: JSX.Element; text: string; linkText: string; href: string }[] = [
  { icon: <IconLifebuoy />, text: "Need help?", linkText: "Contact support", href: "/docs/troubleshooting/support" },
  { icon: <IconChat />, text: "Have a question?", linkText: "Ask the AI assistant", href: "/ask" },
  { icon: <IconHistory />, text: "Check out our", linkText: "changelog", href: "/docs/changelog" },
  { icon: <IconBook />, text: "Dive into the", linkText: "API reference", href: "/docs/api-reference" },
];

/* --- Icons --- */
function IconChat() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconLifebuoy() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288" />
    </svg>
  );
}

function IconHistory() {
  return (
    <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
