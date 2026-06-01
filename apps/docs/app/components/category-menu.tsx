"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/nav-taxonomy";
import type { getTranslations } from "@/lib/translations";

type T = ReturnType<typeof getTranslations>;

interface CategoryMenuProps {
  t: T;
}

export function CategoryMenu({ t }: CategoryMenuProps) {
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

  return (
    <div ref={rootRef} className="flex items-center">
      {/* Desktop: dropdown row */}
      <div className="hidden items-center md:flex">
        {NAV_GROUPS.map((group, i) => {
          const isOpen = open === i;
          return (
            <div
              key={group.path}
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
                  "flex h-8 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium transition-colors duration-[120ms]",
                  isOpen
                    ? "bg-white/[0.08] text-vinr-50"
                    : "text-vinr-50/[0.72] hover:bg-white/[0.08] hover:text-vinr-50",
                ].join(" ")}
              >
                {group.label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={["opacity-60 transition-transform duration-[120ms]", isOpen ? "rotate-180" : ""].join(" ")}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="absolute left-0 top-full z-50 pt-2">
                  <div className="min-w-[230px] overflow-hidden rounded-xl border border-white/[0.1] bg-vinr-800 p-1.5 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">
                    {group.items.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="block rounded-lg px-3 py-2 text-[13px] text-vinr-50/[0.78] transition-colors hover:bg-white/[0.06] hover:text-vinr-50"
                      >
                        {item.label}
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
        className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-vinr-50/[0.72] transition-colors hover:bg-white/[0.08] hover:text-vinr-50 md:hidden"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
        {t.navMenu}
      </button>

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-px max-h-[70vh] overflow-y-auto border-b border-white/[0.07] bg-vinr-900 px-6 py-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
            {NAV_GROUPS.map((group) => (
              <div key={group.path}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-vinr-300">
                  {group.label}
                </div>
                <div className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className="rounded-md py-2 text-[14px] text-vinr-50/[0.78] transition-colors hover:text-vinr-50"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/docs"
              className="text-[13px] font-medium text-vinr-300 transition-colors hover:text-vinr-50"
            >
              {t.navViewAll} →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
