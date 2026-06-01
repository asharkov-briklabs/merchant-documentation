"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchContext } from "fumadocs-ui/contexts/search";
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

/** Search + Ask AI row shown at the top of the API sidebar (mirrors Stripe). */
function SearchAndAsk() {
  const { setOpenSearch } = useSearchContext();

  // `/` keyboard shortcut to open search (when not in an input).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.key !== "/" ||
        e.metaKey ||
        e.ctrlKey ||
        (e.target instanceof HTMLElement &&
          (e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.isContentEditable))
      )
        return;
      e.preventDefault();
      setOpenSearch(true);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setOpenSearch]);

  function openAskAI() {
    window.dispatchEvent(new CustomEvent("ask-ai:open", { detail: { message: "" } }));
  }

  return (
    <div className="mb-3 flex items-center gap-1.5 px-1">
      {/* Search trigger */}
      <button
        type="button"
        onClick={() => setOpenSearch(true)}
        aria-label="Search"
        className="flex h-8 flex-1 items-center gap-2 rounded-md border border-white/[0.10] bg-white/[0.04] px-2.5 text-vinr-50/40 transition-colors hover:border-vinr-500/40 hover:bg-white/[0.07] hover:text-vinr-50/60"
      >
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" strokeLinecap="round" />
        </svg>
        <span className="flex-1 text-left text-[12.5px]">Find anything</span>
        <kbd className="rounded border border-white/[0.10] bg-white/[0.06] px-1 py-px font-mono text-[10px] text-vinr-50/30">
          /
        </kbd>
      </button>

      {/* Ask AI button */}
      <button
        type="button"
        onClick={openAskAI}
        aria-label="Ask AI"
        className="flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-vinr-500/30 bg-vinr-500/[0.12] px-2.5 text-[12.5px] font-medium text-vinr-300 transition-colors hover:border-vinr-500/50 hover:bg-vinr-500/[0.20]"
      >
        <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
          <path d="M8 1l1.2 4.8L14 8l-4.8 1.2L8 15l-1.2-4.8L2 8l4.8-1.2z" />
        </svg>
        Ask AI
      </button>
    </div>
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
        <SearchAndAsk />
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
