import Link from "next/link";
import { VinrWordmark } from "./vinr-wordmark";
import type { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";
import { CategoryMenu } from "./category-menu";
import { SearchTrigger } from "./search-trigger";
import { SidebarToggle } from "./sidebar-toggle";

interface SiteNavProps {
  t: ReturnType<typeof getTranslations>;
  locale: string;
  activeKey?: "docs" | "api" | "ask" | null;
  /** Span full width (for the docs layout) instead of the 1200px marketing width. */
  fluid?: boolean;
}

// Stripe-style two-row top nav:
//   Row 1 (56px): logo · centered search + Ask AI · Sign in
//   Row 2 (44px): category dropdowns · API Reference + Help
// Total sticky height is 100px — the docs layout shifts fumadocs' sidebar/TOC
// sticky offsets to match (see #nd-sidebar/#nd-toc overrides in globals.css).
export function SiteNav({ t, locale, activeKey, fluid }: SiteNavProps) {
  const rowWidth = fluid ? "w-full" : "w-full max-w-[1200px] mx-auto";

  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.07] bg-vinr-900">
      {/* Row 1 — logo / search + Ask AI / Sign in */}
      <div className="h-14 px-6 md:px-10">
        <div className={["grid h-full grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-5", rowWidth].join(" ")}>
          {/* Left: (docs mobile sidebar toggle) + logo */}
          <div className="flex items-center">
            {fluid && <SidebarToggle label={t.navMenu} />}
            <Link href={localeHref(locale, "/")} className="flex items-center">
              <VinrWordmark height={18} fill="#F7FDFC" />
            </Link>
          </div>

          {/* Center: search + Ask AI */}
          <div className="flex items-center justify-end gap-2.5 md:mx-auto md:w-full md:max-w-[440px] md:justify-center">
            <div className="hidden flex-1 md:block">
              <SearchTrigger placeholder={t.searchPlaceholder} variant="nav" />
            </div>
            {/* Mobile: icon-only search */}
            <div className="md:hidden">
              <SearchTrigger placeholder={t.searchPlaceholder} variant="nav" />
            </div>
            <Link
              href={localeHref(locale, "/ask")}
              className={[
                "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-vinr-500/40 px-3.5 text-[13px] font-medium text-vinr-50 transition-colors duration-[120ms]",
                activeKey === "ask"
                  ? "bg-vinr-500/[0.38]"
                  : "bg-vinr-500/25 hover:bg-vinr-500/[0.38]",
              ].join(" ")}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="hidden sm:inline">{t.askAi}</span>
            </Link>
          </div>

          {/* Right: Sign in */}
          <div className="flex items-center justify-end">
            <a
              href="https://dashboard.vinr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 items-center rounded-md border border-white/[0.14] px-3.5 text-[13px] font-medium text-vinr-50 transition-colors duration-[120ms] hover:bg-white/[0.08]"
            >
              {t.signIn}
            </a>
          </div>
        </div>
      </div>

      {/* Row 2 — category dropdowns / API Reference + Help */}
      <div className="h-11 border-t border-white/[0.05] px-6 md:px-10">
        <div className={["flex h-full items-center justify-between gap-3", rowWidth].join(" ")}>
          <CategoryMenu t={t} locale={locale} />

          {/* Right utilities */}
          <div className="hidden items-center gap-1 md:flex">
            <Link
              href={localeHref(locale, "/docs/api-reference")}
              className={[
                "flex h-8 items-center rounded-md px-2.5 text-[13px] font-medium transition-colors duration-[120ms]",
                activeKey === "api"
                  ? "bg-white/[0.08] text-vinr-50"
                  : "text-vinr-50/[0.72] hover:bg-white/[0.08] hover:text-vinr-50",
              ].join(" ")}
            >
              {t.apiReference}
            </Link>
            <Link
              href={localeHref(locale, "/docs/troubleshooting/support")}
              className="flex h-8 items-center rounded-md px-2.5 text-[13px] font-medium text-vinr-50/[0.72] transition-colors duration-[120ms] hover:bg-white/[0.08] hover:text-vinr-50"
            >
              {t.help}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
