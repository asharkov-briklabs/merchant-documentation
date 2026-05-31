"use client";

import { useState } from "react";

type Tone = "light" | "dark";

interface PageActionsProps {
  /** URL of the raw-Markdown endpoint for this page (/api/md/...). */
  markdownPath: string;
  /** Deep link into the Ask-AI assistant, prefilled for this page. */
  askHref: string;
  /** "light" for docs pages, "dark" for the API-reference screen. */
  tone?: Tone;
}

/**
 * Page-level action row (modeled on docs.stripe.com's "Copy for LLM ·
 * View as Markdown · Ask"): copy the page as Markdown, open the raw Markdown,
 * or ask the AI assistant about this page. "Copy" fetches the raw endpoint on
 * click so the page HTML doesn't carry a duplicate copy of its own source.
 */
export function PageActions({ markdownPath, askHref, tone = "light" }: PageActionsProps) {
  const [copied, setCopied] = useState<"idle" | "copied" | "error">("idle");

  function openAskPanel() {
    const message = new URL(askHref, "http://x").searchParams.get("q") ?? "";
    window.dispatchEvent(new CustomEvent("ask-ai:open", { detail: { message } }));
  }

  async function copyPage() {
    try {
      const res = await fetch(markdownPath);
      if (!res.ok) throw new Error(`status ${res.status}`);
      await navigator.clipboard.writeText(await res.text());
      setCopied("copied");
    } catch {
      setCopied("error");
    }
    setTimeout(() => setCopied("idle"), 1600);
  }

  const base =
    "inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium transition-colors";
  const toned =
    tone === "dark"
      ? "text-vinr-50/[0.62] hover:bg-white/[0.08] hover:text-vinr-50"
      : "text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground";
  const cls = `${base} ${toned}`;

  return (
    <div className="not-prose flex flex-wrap items-center justify-end gap-0.5">
      <button type="button" onClick={copyPage} className={cls} aria-label="Copy page as Markdown">
        {copied === "copied" ? (
          <>
            <CheckIcon />
            Copied
          </>
        ) : copied === "error" ? (
          "Copy failed"
        ) : (
          <>
            <CopyIcon />
            Copy page
          </>
        )}
      </button>

      <a href={markdownPath} target="_blank" rel="noopener noreferrer" className={cls}>
        <MarkdownIcon />
        View as Markdown
      </a>

      <button type="button" onClick={openAskPanel} className={cls}>
        <SparkleIcon />
        Ask AI
      </button>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MarkdownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 14.5v-5l2.5 3 2.5-3v5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9.5v5m0 0l-1.8-2m1.8 2l1.8-2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" strokeLinejoin="round" />
    </svg>
  );
}
