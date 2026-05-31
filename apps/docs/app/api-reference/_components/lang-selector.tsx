"use client";

import { useEffect, useRef, useState } from "react";
import { API_LANGUAGES, useApiRef } from "./api-ref-context";

/**
 * SDK/language switcher in the API-reference top bar (mirrors Stripe's
 * "Ruby SDK 19.2.0 ▾"). Picking a language updates the shared context, which
 * re-renders the right-hand code rail to the matching request snippet.
 */
export function LangSelector() {
  const { lang, setLang } = useApiRef();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = API_LANGUAGES.find((l) => l.id === lang) ?? API_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.14] px-3 text-[13px] font-medium text-vinr-50 transition-colors hover:bg-white/[0.08]"
      >
        <span className="text-vinr-50/55">SDK</span>
        {current.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={open ? "rotate-180 transition-transform" : "transition-transform"}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-lg border border-white/[0.1] bg-vinr-800 py-1 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
        >
          {API_LANGUAGES.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                role="option"
                aria-selected={l.id === lang}
                onClick={() => {
                  setLang(l.id);
                  setOpen(false);
                }}
                className={[
                  "flex w-full items-center justify-between px-3 py-1.5 text-left text-[13px] transition-colors",
                  l.id === lang
                    ? "bg-white/[0.06] text-vinr-50"
                    : "text-vinr-50/70 hover:bg-white/[0.05] hover:text-vinr-50",
                ].join(" ")}
              >
                {l.label}
                {l.id === lang && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
