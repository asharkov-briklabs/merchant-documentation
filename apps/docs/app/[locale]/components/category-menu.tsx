"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/nav-taxonomy";
import { localeHref } from "@/lib/locale-href";
import type { getTranslations } from "@/lib/translations";

type T = ReturnType<typeof getTranslations>;

interface CategoryMenuProps {
  t: T;
  locale: string;
}

export function CategoryMenu({ t, locale }: CategoryMenuProps) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape and outside click.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  const h = (p: string) => localeHref(locale, p);

  return (
    <div ref={rootRef} className="flex items-center">
      {/* Desktop: dropdown row */}
      <div className="hidden items-center gap-0.5 md:flex">
        {NAV_GROUPS.map((group, i) => {
          const isOpen = open === i;
          return (
            <div
              key={group.titleKey}
              className="relative"
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen((cur) => (cur === i ? null : cur))}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="true"
                onClick={() => setOpen(isOpen ? null : i)}
                className={[
                  "flex h-8 items-center gap-1 rounded-md px-3 text-[13px] font-medium transition-colors duration-[120ms]",
                  isOpen
                    ? "bg-white/[0.08] text-[#f7fdfc]"
                    : "text-[rgba(247,253,252,0.72)] hover:bg-white/[0.08] hover:text-[#f7fdfc]",
                ].join(" ")}
              >
                {t[group.titleKey]}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={["transition-transform duration-[120ms]", isOpen ? "rotate-180" : ""].join(" ")}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <div className="w-[300px] overflow-hidden rounded-xl border border-white/[0.1] bg-[#082d35] p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={h(item.path)}
                        className="group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <span className="text-[13px] font-semibold text-[#f7fdfc] transition-colors group-hover:text-[#97d1d1]">
                          {t[item.labelKey]}
                        </span>
                        <span className="text-[12px] leading-[1.4] text-[rgba(247,253,252,0.5)]">
                          {t[item.descKey]}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: single menu button */}
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-haspopup="true"
        onClick={() => setMobileOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-[rgba(247,253,252,0.72)] transition-colors hover:bg-white/[0.08] hover:text-[#f7fdfc] md:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
        {t.navMenu}
      </button>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-px border-b border-white/[0.07] bg-[#05191d] px-6 py-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.titleKey}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#97d1d1]">
                  {t[group.titleKey]}
                </div>
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      href={h(item.path)}
                      className="rounded-md py-2 text-[14px] text-[rgba(247,253,252,0.78)] transition-colors hover:text-[#f7fdfc]"
                    >
                      {t[item.labelKey]}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href={h("/docs")}
              className="text-[13px] font-medium text-[#97d1d1] transition-colors hover:text-[#f7fdfc]"
            >
              {t.navViewAll} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
