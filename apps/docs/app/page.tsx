import Link from "next/link";
import { TrackedLink } from "./components/tracked-link";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { HeroMeshBg } from "./components/hero-mesh-bg";
import { CodeCard } from "./components/code-card";
import { SearchTrigger } from "./components/search-trigger";
import { getTranslations } from "@/lib/translations";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { Category } from "@/lib/schema";
import { SITE_URL } from "@/lib/site-url";

export default function HomePage() {
  const t = getTranslations();

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
            url: SITE_URL,
          }),
        }}
      />
      <SiteNav t={t} activeKey="docs" />

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
              <TrackedLink
                href="/docs/getting-started/quick-start"
                eventLabel="get_started"
                eventLocation="hero"
                className="flex h-10 items-center gap-1.5 rounded-lg bg-vinr-500 px-5 text-sm font-medium text-white transition-colors hover:bg-vinr-600"
              >
                {t.getStartedCta}
              </TrackedLink>
              <TrackedLink
                href="/api-reference"
                eventLabel="api_reference"
                eventLocation="hero"
                className="text-sm font-medium text-white/50 transition-colors hover:text-vinr-50"
              >
                {t.apiReference}
              </TrackedLink>
              <span className="text-xs text-white/20">·</span>
              <Link
                href="/docs/payments"
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
            <TrackedLink
              href="/docs/getting-started/quick-start"
              eventLabel="get_started"
              eventLocation="docs_intro"
              className="flex h-10 items-center gap-1.5 rounded-lg bg-vinr-700 px-5 text-sm font-medium text-white transition-colors hover:bg-vinr-800"
            >
              {t.getStartedCta}
            </TrackedLink>
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
                        href={link.href}
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
                    href={task.href}
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
                      <Link key={slug} href={`/docs/${slug}`} className="group block">
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

      <SiteFooter t={t} />
    </main>
  );
}

/* --- Home content (curated marketing views) --- */

const QUICK_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Payments",
    links: [
      { label: "Accept payments online", href: "/docs/payments" },
      { label: "Payment methods & rails", href: "/docs/payments/payment-methods" },
      { label: "Accept payments in-person", href: "/docs/payments/in-person" },
      { label: "Unified commerce", href: "/docs/payments/omnichannel" },
      { label: "Plugins", href: "/docs/payments/plugins" },
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
      { label: "Full API reference", href: "/api-reference" },
      { label: "Webhooks & events", href: "/docs/integration/webhooks" },
    ],
  },
];

const TRY_TASKS: { label: string; href: string }[] = [
  { label: "Accept a payment", href: "/docs/guides/accept-a-payment" },
  { label: "Collect an in-person payment", href: "/docs/guides/collect-in-person-payment" },
  { label: "Install the WooCommerce plugin", href: "/docs/guides/install-the-woocommerce-plugin" },
  { label: "Create a subscription", href: "/docs/billing/subscriptions/creating-subscriptions" },
  { label: "Save & reuse cards", href: "/docs/guides/save-and-reuse-cards" },
  { label: "Earn loyalty at checkout", href: "/docs/guides/earn-loyalty-at-checkout" },
];

const PRODUCT_BUCKETS: { group: string; slugs: Category[] }[] = [
  { group: "Payments", slugs: ["payments", "integration", "compliance"] },
  { group: "Revenue", slugs: ["billing", "engagement"] },
  { group: "Money management", slugs: ["operations"] },
  { group: "Developer tools", slugs: ["getting-started", "api-reference", "guides", "troubleshooting", "changelog"] },
];

