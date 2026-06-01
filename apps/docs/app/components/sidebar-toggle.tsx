"use client";

import { useSidebar } from "fumadocs-ui/components/sidebar/base";

/**
 * Mobile-only trigger for the fumadocs docs sidebar (page tree). Needed
 * because replacing DocsLayout's built-in navbar (via nav.component) also
 * removes its built-in sidebar toggle. Only render this inside DocsLayout —
 * useSidebar() reads a context that only the docs layout provides.
 */
export function SidebarToggle({ label }: { label?: string }) {
  const { open, setOpen } = useSidebar();
  // fumadocs setOpen is typed as (v: boolean) => void, not React.Dispatch, so
  // it cannot accept a functional updater — `setOpen((v) => !v)` fails the
  // type check. Using `!open` is fine in practice: the sidebar is a mobile-only
  // element and two uncoalesced click events within a single 16ms frame are not
  // a realistic scenario here.
  return (
    <button
      type="button"
      aria-label={label ?? "Toggle sidebar"}
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className="-ml-1 mr-1 grid h-9 w-9 place-items-center rounded-md text-vinr-50/[0.72] transition-colors hover:bg-white/[0.08] hover:text-vinr-50 md:hidden"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 3v18" strokeLinecap="round" />
      </svg>
    </button>
  );
}
