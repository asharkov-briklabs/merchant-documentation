import Link from "next/link";
import { VinrWordmark } from "./vinr-wordmark";
import type { getTranslations } from "@/lib/translations";
import { localeHref } from "@/lib/locale-href";

interface SiteFooterProps {
  t: ReturnType<typeof getTranslations>;
  locale: string;
}

export function SiteFooter({ t, locale }: SiteFooterProps) {
  return (
    <footer className="bg-vinr-900 px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-start justify-between gap-16 py-12">
          <div className="shrink-0">
            <VinrWordmark height={16} fill="#F7FDFC" />
            <p className="mt-2.5 max-w-[220px] text-xs leading-[1.5] text-white/40">
              {t.footerTagline}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/45">
                {t.documentation}
              </h4>
              <Link href={localeHref(locale, "/docs/getting-started/quick-start")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.quickStart}
              </Link>
              <Link href={localeHref(locale, "/docs/api-reference")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.apiReference}
              </Link>
              <Link href={localeHref(locale, "/docs/integration/webhooks")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.webhooks}
              </Link>
              <Link href={localeHref(locale, "/docs/payments")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.payments}
              </Link>
            </div>

            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/45">
                {t.resources}
              </h4>
              <Link href={localeHref(locale, "/ask")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.aiAssistant}
              </Link>
              <Link href={localeHref(locale, "/docs/troubleshooting")} className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                {t.troubleshooting}
              </Link>
              <a href="/llms.txt" className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                llms.txt
              </a>
            </div>

            <div>
              <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-white/45">
                {t.company}
              </h4>
              <a href="https://vinr.com" target="_blank" rel="noopener noreferrer" className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                vinr.com
              </a>
              <a href="https://dashboard.vinr.com" target="_blank" rel="noopener noreferrer" className="mb-2 block text-[12px] text-white/55 transition-colors hover:text-vinr-50">
                Dashboard
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] pb-8 pt-6">
          <span className="font-mono text-[11px] text-white/30">{t.footerCopy}</span>
          <div className="flex gap-2">
            <span className="flex items-center gap-[5px] rounded-full border border-white/[0.1] px-2 py-[3px] text-[10px] font-medium tracking-[0.03em] text-white/40">
              <span className="h-[5px] w-[5px] rounded-full bg-lime-500" />
              {t.complianceBadge1}
            </span>
            <span className="flex items-center gap-[5px] rounded-full border border-white/[0.1] px-2 py-[3px] text-[10px] font-medium tracking-[0.03em] text-white/40">
              <span className="h-[5px] w-[5px] rounded-full bg-lime-500" />
              {t.complianceBadge2}
            </span>
            <span className="flex items-center gap-[5px] rounded-full border border-white/[0.1] px-2 py-[3px] text-[10px] font-medium tracking-[0.03em] text-white/40">
              {t.complianceBadge3}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
