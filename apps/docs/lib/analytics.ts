declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (command: string, key: string, value?: string) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

export function trackPageView(url: string, title: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!gaId) return;
  window.gtag("config", gaId, { page_path: url, page_title: title });
}

export function clarityTag(key: string, value: string) {
  if (typeof window === "undefined" || !window.clarity) return;
  window.clarity("set", key, value);
}
