"use client";

import { useState } from "react";
import Link from "next/link";
import type { getTranslations } from "@/lib/translations";

type T = ReturnType<typeof getTranslations>;

// Bump this id whenever the message changes so a dismissed banner re-appears.
const BANNER_ID = "stablecoin-payouts-2026-05";
// Cookie (not localStorage) so the server can read the dismissed state and
// render the correct markup on first paint — no post-hydration flip / CLS.
export const BANNER_COOKIE = `vinr-banner-${BANNER_ID}`;
const BANNER_HREF = "/docs/changelog";

interface AnnouncementBannerProps {
  t: T;
  /** Read from the cookie server-side so SSR matches the client. */
  initiallyDismissed?: boolean;
}

export function AnnouncementBanner({ t, initiallyDismissed }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(initiallyDismissed ?? false);

  if (dismissed) return null;

  return (
    <div className="relative border-b border-white/[0.07] bg-vinr-800 px-10">
      <div className="mx-auto flex h-10 max-w-[1200px] items-center justify-center gap-2 text-[13px]">
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-vinr-500 shadow-[0_0_8px_rgba(42,157,144,0.7)]" />
        <span className="text-vinr-50/[0.78]">{t.bannerText}</span>
        <Link
          href={BANNER_HREF}
          className="font-medium text-vinr-300 transition-colors hover:text-vinr-50"
        >
          {t.bannerCta} →
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          document.cookie = `${BANNER_COOKIE}=dismissed; path=/; max-age=31536000; samesite=lax`;
          setDismissed(true);
        }}
        className="absolute right-10 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded text-vinr-50/40 transition-colors hover:bg-white/[0.08] hover:text-vinr-50"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
