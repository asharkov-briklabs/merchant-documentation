"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ApiNavNode =
  | { type: "section"; label: string }
  | { type: "link"; title: string; url: string };

/* --- Mobile open/close state shared between the top-bar toggle and drawer --- */

const ApiNavContext = createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
} | null>(null);

export function ApiNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ApiNavContext.Provider value={{ open, setOpen }}>
      {children}
    </ApiNavContext.Provider>
  );
}

function useApiNav() {
  const ctx = useContext(ApiNavContext);
  if (!ctx) throw new Error("useApiNav must be used within <ApiNavProvider>");
  return ctx;
}

/** Hamburger shown in the API top bar on small screens. */
export function ApiNavToggle() {
  const { open, setOpen } = useApiNav();
  return (
    <button
      type="button"
      aria-label="Toggle API navigation"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="-ml-1 grid h-9 w-9 place-items-center rounded-md text-vinr-50/[0.72] transition-colors hover:bg-white/[0.08] hover:text-vinr-50 lg:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/** Left navigation column listing every API-reference page, grouped by section. */
export function ApiSidebar({ nav }: { nav: ApiNavNode[] }) {
  const { open, setOpen } = useApiNav();
  const pathname = usePathname();

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-14 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav
        className={[
          "z-40 w-[260px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-vinr-900 px-3 py-5",
          // Desktop: sticky column. Mobile: off-canvas drawer toggled by `open`.
          "fixed bottom-0 left-0 top-14 transition-transform lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <ul className="flex flex-col gap-0.5">
          {nav.map((node, i) =>
            node.type === "section" ? (
              <li
                key={`s-${i}`}
                className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-[0.06em] text-vinr-50/40 first:pt-1"
              >
                {node.label}
              </li>
            ) : (
              <ApiNavLink
                key={node.url}
                title={node.title}
                href={node.url}
                active={pathname === node.url}
              />
            ),
          )}
        </ul>
      </nav>
    </>
  );
}

function ApiNavLink({
  title,
  href,
  active,
}: {
  title: string;
  href: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={[
          "block rounded-md px-3 py-[7px] text-[13.5px] leading-tight transition-colors",
          active
            ? "bg-vinr-500/[0.16] font-medium text-vinr-300"
            : "text-vinr-50/[0.66] hover:bg-white/[0.05] hover:text-vinr-50",
        ].join(" ")}
      >
        {title}
      </Link>
    </li>
  );
}
