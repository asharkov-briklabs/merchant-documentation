"use client";

import { useSidebarBridge } from "./sidebar-bridge";

/**
 * Mobile-only trigger for the fumadocs docs sidebar. Uses SidebarBridgeContext
 * so it can render outside DocsLayout's grid (in the top-level SiteNav).
 * Returns null automatically on pages without a sidebar.
 */
export function SidebarToggle({ label }: { label?: string }) {
  const sidebar = useSidebarBridge();
  if (!sidebar) return null;

  const { open, setOpen } = sidebar;
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
