import Link from "next/link";
import { cookies } from "next/headers";
import { localeHref } from "@/lib/locale-href";
import { SiteNav } from "./components/site-nav";
import { SiteFooter } from "./components/site-footer";
import { HeroMeshBg } from "./components/hero-mesh-bg";
import { CodeCard } from "./components/code-card";
import { SearchTrigger } from "./components/search-trigger";
import { SectionHeading } from "./components/section-heading";
import { AnnouncementBanner, BANNER_COOKIE } from "./components/announcement-banner";
import { getTranslations } from "@/lib/translations";

export default function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = getTranslations(params.locale);
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
                href={localeHref(params.locale, "/docs/getting-started/quick-start")}
                className="flex h-10 items-center gap-1.5 rounded-lg bg-vinr-500 px-5 text-sm font-medium text-white transition-colors hover:bg-vinr-600"
              >
                {t.getStartedCta}
              </Link>
              <Link
                href={localeHref(params.locale, "/docs/api-reference")}
                className="text-sm font-medium text-white/50 transition-colors hover:text-vinr-50"
              >
                {t.apiReference}
              </Link>
              <span className="text-xs text-white/20">·</span>
              <Link
                href={localeHref(params.locale, "/docs/payments")}
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

      {/* Use Cases */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-10 py-14">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow={t.useCasesEyebrow} title={t.useCasesTitle} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {getUseCases(t, params.locale).map((section) => (
              <div
                key={section.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-vinr-200 hover:shadow-[0_4px_12px_rgba(11,59,69,0.06)]"
              >
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-vinr-100 text-vinr-700">
                    <section.icon />
                  </div>
                  <span className="text-sm font-semibold text-vinr-700">{section.title}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="group flex items-center gap-2 text-[13px] text-zinc-800 transition-colors hover:text-vinr-700"
                    >
                      <svg className="h-3 w-3 shrink-0 opacity-45 transition-opacity group-hover:opacity-100" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="border-b border-zinc-200 bg-white px-10 py-14">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow={t.productsEyebrow} title={t.browseByProduct} mb="none" />
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {getProducts(t).map((product) => (
              <Link
                key={product.slug}
                href={localeHref(params.locale, `/docs/${product.slug}`)}
                className="group flex flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-vinr-200 hover:shadow-[0_4px_12px_rgba(11,59,69,0.06)]"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 bg-zinc-50 text-vinr-700 transition-colors group-hover:border-vinr-200 group-hover:bg-vinr-100">
                  <product.icon />
                </div>
                <div className="text-sm font-semibold text-vinr-700">{product.title}</div>
                <div className="text-xs leading-[1.5] text-zinc-800">{product.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Developer resources */}
      <section className="border-b border-zinc-200 bg-zinc-50 px-10 py-14">
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading eyebrow={t.devResEyebrow} title={t.devResTitle} mb="none" />
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {getDevResources(t, params.locale).map((r) => (
              <Link
                key={r.label}
                href={r.href}
                className="group rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all hover:border-vinr-200 hover:shadow-[0_4px_12px_rgba(11,59,69,0.06)]"
              >
                <div className="mb-3 grid h-8 w-8 place-items-center rounded-[7px] bg-vinr-100 text-vinr-700 transition-colors group-hover:bg-vinr-700 group-hover:text-vinr-50">
                  <r.icon />
                </div>
                <div className="text-[13px] font-semibold text-vinr-700">{r.label}</div>
                <div className="mt-1 text-xs leading-[1.5] text-zinc-800">{r.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter t={t} locale={params.locale} />
    </main>
  );
}

/* --- Helpers --- */
type T = ReturnType<typeof getTranslations>;

function getUseCases(t: T, locale: string) {
  const h = (p: string) => localeHref(locale, p);
  return [
    {
      title: t.useCasePayments,
      icon: IconCreditCard,
      links: [
        { label: t.acceptOnlinePayments, href: h("/docs/payments") },
        { label: t.paymentMethodsRails, href: h("/docs/payments") },
        { label: t.settlementPayouts, href: h("/docs/operations") },
      ],
    },
    {
      title: t.useCaseIntegration,
      icon: IconLink,
      links: [
        { label: t.quickStartGuide, href: h("/docs/getting-started/quick-start") },
        { label: t.authenticationKeys, href: h("/docs/getting-started/authentication") },
        { label: t.webhooksEvents, href: h("/docs/integration/webhooks") },
      ],
    },
    {
      title: t.useCaseDevelopers,
      icon: IconTerminal,
      links: [
        { label: t.fullApiReference, href: h("/docs/api-reference") },
        { label: t.sdksLibraries, href: h("/docs/integration") },
        { label: t.troubleshooting, href: h("/docs/troubleshooting") },
      ],
    },
  ];
}

function getProducts(t: T) {
  return [
    { slug: "getting-started", icon: IconRocket, title: t.gettingStarted, description: t.gettingStartedDesc },
    { slug: "payments", icon: IconCreditCard, title: t.paymentsTitle, description: t.paymentsDesc },
    { slug: "integration", icon: IconLink, title: t.integration, description: t.integrationDesc },
    { slug: "operations", icon: IconCog, title: t.operations, description: t.operationsDesc },
    { slug: "compliance", icon: IconShield, title: t.compliance, description: t.complianceDesc },
    { slug: "api-reference", icon: IconBook, title: t.apiReferenceTitle, description: t.apiReferenceDesc },
    { slug: "troubleshooting", icon: IconWrench, title: t.troubleshootingTitle, description: t.troubleshootingDesc },
  ];
}

function getDevResources(t: T, locale: string) {
  const h = (p: string) => localeHref(locale, p);
  return [
    { icon: IconTerminal, label: t.apiExplorer, description: t.apiExplorerDesc, href: h("/docs/api-reference") },
    { icon: IconWebhook, label: t.webhooks, description: t.webhooksDesc, href: h("/docs/integration/webhooks") },
    { icon: IconBolt, label: t.quickStart, description: t.quickStartDesc, href: h("/docs/getting-started/quick-start") },
    { icon: IconChat, label: t.aiAssistant, description: t.aiAssistantDesc, href: h("/ask") },
  ];
}

/* --- Icons --- */
function IconRocket() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.841m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  );
}

function IconCreditCard() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.702a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
    </svg>
  );
}

function IconCog() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
    </svg>
  );
}

function IconTerminal() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  );
}

function IconWebhook() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}
