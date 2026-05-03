import Link from "next/link";
import { VinrWordmark } from "./vinr-wordmark";
import type { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";

interface SiteNavProps {
  t: ReturnType<typeof getTranslations>;
  locale: string;
  activeKey?: "docs" | "api" | "ask" | null;
}

export function SiteNav({ t, locale, activeKey }: SiteNavProps) {
  const altLocale = locale === "en" ? "bg" : "en";
  const altLabel = locale === "en" ? "BG" : "EN";

  return (
    <nav
      className="sticky top-0 z-40 h-14 border-b border-white/[0.07] bg-[#05191d] px-10"
      style={{ height: 56 }}
    >
      <div className="flex h-full w-full max-w-[1200px] mx-auto items-center gap-0">
        <Link href={localeHref(locale, "/")} className="flex items-center">
          <VinrWordmark height={18} fill="#F7FDFC" />
        </Link>

        <div className="mx-6 h-[18px] w-px bg-white/[0.15]" />

        <div className="flex items-center gap-1">
          <Link
            href={localeHref(locale, "/docs")}
            className={[
              "flex h-8 items-center rounded-md px-3 text-[13px] font-medium transition-colors duration-[120ms]",
              activeKey === "docs"
                ? "text-[#f7fdfc]"
                : "text-[rgba(247,253,252,0.72)] hover:bg-white/[0.08] hover:text-[#f7fdfc]",
            ].join(" ")}
          >
            {t.docs}
          </Link>
          <Link
            href={localeHref(locale, "/docs/api-reference")}
            className={[
              "flex h-8 items-center rounded-md px-3 text-[13px] font-medium transition-colors duration-[120ms]",
              activeKey === "api"
                ? "text-[#f7fdfc]"
                : "text-[rgba(247,253,252,0.72)] hover:bg-white/[0.08] hover:text-[#f7fdfc]",
            ].join(" ")}
          >
            {t.api}
          </Link>
        </div>

        <div className="flex-1" />

        <Link
          href={localeHref(locale, "/ask")}
          className={[
            "flex h-8 items-center gap-1.5 rounded-md border border-[rgba(42,157,144,0.4)] px-3.5 text-[13px] font-medium text-[#f7fdfc] transition-colors duration-[120ms]",
            activeKey === "ask"
              ? "bg-[rgba(42,157,144,0.38)]"
              : "bg-[rgba(42,157,144,0.25)] hover:bg-[rgba(42,157,144,0.38)]",
          ].join(" ")}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {t.askAi}
        </Link>

        <Link
          href={localeHref(altLocale, "/")}
          className="ml-3 flex h-8 items-center gap-1 rounded-md border border-white/[0.12] px-2.5 text-[12px] text-[rgba(247,253,252,0.55)] transition-colors hover:text-[#f7fdfc]"
        >
          {altLabel} ▾
        </Link>
      </div>
    </nav>
  );
}
