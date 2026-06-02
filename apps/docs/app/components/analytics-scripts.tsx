"use client";

import { useEffect } from "react";

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

function injectScript(src: string) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.head.appendChild(s);
}

export function AnalyticsScripts() {
  useEffect(() => {
    if (gaId && !window.gtag) {
      // Standard gtag bootstrap — pushes arguments objects to dataLayer, which
      // gtag.js reads when it resolves asynchronously. Must use `arguments` (not
      // rest params) so dataLayer entries match what gtag.js expects.
      window.dataLayer = window.dataLayer ?? [];
      const dl = window.dataLayer;
      const gtag = function gtag() { dl.push(arguments); } as unknown as (...args: unknown[]) => void;
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", gaId, { send_page_view: false });
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
    }

    if (clarityId && !window.clarity) {
      // Standard Clarity bootstrap — queues calls on .q so the real Clarity
      // script can process them after it loads asynchronously.
      const q: unknown[][] = [];
      const fn = Object.assign(
        (...args: unknown[]) => { q.push(args); },
        { q }
      );
      window.clarity = fn as unknown as typeof window.clarity;
      injectScript(`https://www.clarity.ms/tag/${clarityId}`);
    }
  }, []);

  return null;
}
