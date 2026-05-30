"use client";

import { useSearchContext } from "fumadocs-ui/provider";

interface SearchTriggerProps {
  placeholder?: string;
  variant?: "light" | "dark" | "nav";
}

export function SearchTrigger({ placeholder, variant = "light" }: SearchTriggerProps) {
  const { setOpenSearch } = useSearchContext();

  const isDark = variant === "dark";

  // Centered nav search box (dark theme). Fills its container on md+,
  // collapses to an icon-only button on small screens.
  if (variant === "nav") {
    return (
      <button
        type="button"
        onClick={() => setOpenSearch(true)}
        aria-label={placeholder ?? "Search"}
        className="flex h-9 w-9 items-center justify-center gap-2.5 rounded-lg border border-white/[0.12] bg-white/[0.05] text-[rgba(247,253,252,0.5)] transition-colors hover:border-[rgba(42,157,144,0.5)] hover:bg-white/[0.08] md:w-full md:justify-start md:px-3.5"
      >
        <svg className="h-4 w-4 shrink-0 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4-4" strokeLinecap="round" />
        </svg>
        <span className="hidden flex-1 text-left text-[13px] md:inline">{placeholder ?? "Search"}</span>
        <kbd className="hidden rounded border border-white/[0.12] bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] font-medium text-white/40 md:inline-block">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpenSearch(true)}
      className={[
        "flex w-full items-center gap-3 rounded-[10px] px-4 transition-colors",
        isDark
          ? "max-w-[440px] h-12 bg-white/[0.06] border border-white/[0.14] text-white/40 hover:bg-white/[0.09] hover:border-[rgba(42,157,144,0.5)]"
          : "max-w-[420px] mt-5 py-2.5 border border-fd-border bg-fd-card text-sm text-fd-muted-foreground shadow-sm hover:border-fd-primary/40 hover:bg-fd-accent/50",
      ].join(" ")}
    >
      <svg
        className={["h-4 w-4 shrink-0", isDark ? "text-white/35" : ""].join(" ")}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" strokeLinecap="round" />
      </svg>
      <span className={["flex-1 text-left text-sm", isDark ? "text-white/40" : ""].join(" ")}>
        {placeholder ?? "Search documentation..."}
      </span>
      <div className={isDark ? "flex gap-[3px]" : ""}>
        <kbd
          className={[
            "rounded px-1.5 py-0.5 text-[10px] font-medium",
            isDark
              ? "bg-white/[0.08] border border-white/[0.12] text-white/40 font-mono"
              : "hidden border border-fd-border text-[11px] text-fd-muted-foreground sm:inline-block",
          ].join(" ")}
        >
          ⌘
        </kbd>
        {isDark && (
          <kbd className="rounded bg-white/[0.08] border border-white/[0.12] px-1.5 py-0.5 text-[10px] font-medium font-mono text-white/40">
            K
          </kbd>
        )}
        {!isDark && (
          <kbd className="hidden rounded border border-fd-border px-1.5 py-0.5 text-[11px] font-medium text-fd-muted-foreground sm:inline-block">
            K
          </kbd>
        )}
      </div>
    </button>
  );
}
