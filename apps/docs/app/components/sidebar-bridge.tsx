"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSidebar } from "fumadocs-ui/components/sidebar/base";

interface SidebarBridge {
  open: boolean;
  setOpen: (v: boolean) => void;
}

// Null = no sidebar exists on this page (home, ask, etc.)
const BridgeCtx = createContext<SidebarBridge | null>(null);

/**
 * Wrap around (SiteNav + DocsLayout). Provides the shared sidebar state that
 * lets SiteNav's toggle control the fumadocs sidebar even though the nav is
 * rendered outside DocsLayout's grid.
 */
export function SidebarBridgeProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <BridgeCtx.Provider value={{ open, setOpen }}>{children}</BridgeCtx.Provider>;
}

/**
 * Renders as a child of DocsLayout. Syncs the bridge state ↔ fumadocs sidebar
 * state so both the toggle (outside) and the drawer overlay (inside) agree.
 */
export function SidebarBridgeSetter() {
  const { open: docsOpen, setOpen: docsSetOpen } = useSidebar();
  const bridge = useContext(BridgeCtx);

  // fumadocs → bridge (drawer closed via overlay, link click, etc.)
  useEffect(() => {
    if (bridge && docsOpen !== bridge.open) bridge.setOpen(docsOpen);
  }, [docsOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // bridge → fumadocs (toggle button pressed)
  useEffect(() => {
    if (bridge && bridge.open !== docsOpen) docsSetOpen(bridge.open);
  }, [bridge?.open]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

/** Returns the bridge state, or null on pages without a sidebar. */
export function useSidebarBridge() {
  return useContext(BridgeCtx);
}
