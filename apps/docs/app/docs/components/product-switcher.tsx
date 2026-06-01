"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { LayoutTab } from "fumadocs-ui/layouts/shared";

/**
 * Sidebar product switcher — replaces the removed fumadocs v16 RootToggle.
 * Placed in DocsLayout's sidebar.banner slot so it appears at the top of the
 * sidebar on every docs page, scoped to the active section.
 */
export function ProductSwitcher({ tabs }: { tabs: LayoutTab[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = tabs.find((t) => pathname.startsWith(t.url)) ?? tabs[0];

  // Close on outside click
  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  return (
    <div ref={ref} className="relative px-3 pb-3 pt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-left text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
      >
        {active?.icon && (
          <span className="shrink-0 text-fd-primary [&_svg]:size-4">
            {active.icon}
          </span>
        )}
        <span className="flex-1 truncate">
          {typeof active?.title === "string" ? active.title : "Docs"}
        </span>
        <svg
          className={`size-3.5 shrink-0 text-fd-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-3 top-full z-50 mt-1 overflow-hidden rounded-lg border border-fd-border bg-fd-popover shadow-md">
          {tabs.map((tab) => {
            const isActive = active?.url === tab.url;
            return (
              <Link
                key={tab.url}
                href={tab.url}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-fd-accent text-fd-accent-foreground font-medium"
                    : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
                }`}
              >
                {tab.icon && (
                  <span className="shrink-0 [&_svg]:size-3.5">{tab.icon}</span>
                )}
                <span className="truncate">
                  {typeof tab.title === "string" ? tab.title : ""}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
