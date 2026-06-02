"use client";

import { useEffect } from "react";
import { trackPageView, clarityTag } from "@/lib/analytics";

// Fires a page_view event and tags the Clarity session on every navigation.
// Uses a MutationObserver on <title> instead of usePathname — Next.js (and
// most SPAs) update document.title on each navigation, making this
// framework-agnostic. Deduplicates against the last-seen pathname so that
// multiple title mutations during a single navigation don't fire twice.
export function PageViewTracker() {
  useEffect(() => {
    let lastPathname = "";

    function track() {
      const pathname = window.location.pathname;
      if (pathname === lastPathname) return;
      lastPathname = pathname;
      trackPageView(pathname, document.title);
      clarityTag("section", pathname.split("/")[1] ?? "home");
    }

    track(); // initial page view on mount

    const titleEl = document.querySelector("title");
    if (!titleEl) return;

    const observer = new MutationObserver(track);
    observer.observe(titleEl, { childList: true, characterData: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
