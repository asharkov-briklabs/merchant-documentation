"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { localeHref } from "@/lib/locale-href";
import type { getTranslations } from "@/lib/translations";

type T = ReturnType<typeof getTranslations>;

// Bump this id whenever the message changes so a dismissed banner re-appears.
const BANNER_ID = "stablecoin-payouts-2026-05";
const STORAGE_KEY = `vinr-banner-${BANNER_ID}`;
const BANNER_HREF = "/docs/changelog";

interface AnnouncementBannerProps {
  t: T;
  locale: string;
}

export function AnnouncementBanner({ t, locale }: AnnouncementBannerProps) {
  // Start hidden to avoid a flash before we can read localStorage.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_KEY) !== "dismissed");
  }, []);

  if (!visible) return null;

  return (
    <div className="relative border-b border-white/[0.07] bg-[#082d35] px-10">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-center gap-2 text-[13px]">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#2a9d90] shadow-[0_0_8px_rgba(42,157,144,0.7)]" />
        <span className="text-[rgba(247,253,252,0.78)]">{t.bannerText}</span>
        <Link
          href={localeHref(locale, BANNER_HREF)}
          className="font-medium text-[#97d1d1] transition-colors hover:text-[#f7fdfc]"
        >
          {t.bannerCta} →
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, "dismissed");
          setVisible(false);
        }}
        className="absolute right-10 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded text-[rgba(247,253,252,0.4)] transition-colors hover:bg-white/[0.08] hover:text-[#f7fdfc]"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
