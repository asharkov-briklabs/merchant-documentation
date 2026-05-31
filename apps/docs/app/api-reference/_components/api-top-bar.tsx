"use client";

import Link from "next/link";
import { VinrWordmark } from "../../components/vinr-wordmark";
import { LangSelector } from "./lang-selector";
import { ApiNavToggle } from "./api-sidebar";

/**
 * Dedicated top bar for the API-reference screen (mirrors docs.stripe.com/api):
 * wordmark + "API" tag · SDK/language selector · a "Docs" link back to the main
 * site · Sign in. Distinct from the marketing SiteNav so the reference reads as
 * its own surface.
 */
export function ApiTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-vinr-900">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        {/* Left: mobile nav toggle + wordmark + API tag */}
        <div className="flex items-center gap-2.5">
          <ApiNavToggle />
          <Link href="/" className="flex items-center gap-2">
            <VinrWordmark height={17} fill="#F7FDFC" />
            <span className="text-[15px] font-semibold text-vinr-50/80">API</span>
          </Link>
        </div>

        {/* Right utilities */}
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <LangSelector />
          <Link
            href="/docs"
            className="hidden h-8 items-center rounded-md px-2.5 text-[13px] font-medium text-vinr-50/[0.72] transition-colors hover:bg-white/[0.08] hover:text-vinr-50 sm:flex"
          >
            Docs
          </Link>
          <Link
            href="/docs/troubleshooting/support"
            className="hidden h-8 items-center rounded-md px-2.5 text-[13px] font-medium text-vinr-50/[0.72] transition-colors hover:bg-white/[0.08] hover:text-vinr-50 md:flex"
          >
            Support
          </Link>
          <a
            href="https://dashboard.vinr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 items-center rounded-md border border-white/[0.14] px-3.5 text-[13px] font-medium text-vinr-50 transition-colors hover:bg-white/[0.08]"
          >
            Sign in
          </a>
        </div>
      </div>
    </header>
  );
}
