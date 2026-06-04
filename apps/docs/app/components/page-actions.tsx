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
  /** URL for the "Install skills" action. Omit to hide that button. */
  installSkillsHref?: string;
}

/**
 * Page-level action row — sits below the page title and description.
 * Actions: Ask about this page | Copy for LLM | View as Markdown | Install skills
 */
export function PageActions({
  markdownPath,
  askHref,
  tone = "light",
  installSkillsHref,
}: PageActionsProps) {
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

  const muted =
    tone === "dark"
      ? "text-vinr-50/[0.55] hover:text-vinr-50"
      : "text-fd-muted-foreground hover:text-fd-foreground";

  const btn = `inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-colors ${muted}`;
  const sep = tone === "dark" ? "text-vinr-50/20" : "text-fd-border";

  return (
    <div className={`not-prose flex flex-wrap items-center gap-x-3 gap-y-1 ${tone === "light" ? "border-b border-fd-border pb-4 pt-1" : ""}`}>
      <button type="button" onClick={openAskPanel} className={btn}>
        <SparkleIcon />
        Ask about this page
      </button>

      <span className={sep} aria-hidden>|</span>

      <button type="button" onClick={copyPage} className={btn} aria-label="Copy page as Markdown for LLM">
        {copied === "copied" ? (
          <><CheckIcon />Copied</>
        ) : copied === "error" ? (
          "Copy failed"
        ) : (
          <><CopyIcon />Copy for LLM</>
        )}
      </button>

      <span className={sep} aria-hidden>|</span>

      <a href={markdownPath} target="_blank" rel="noopener noreferrer" className={btn}>
        <MarkdownIcon />
        View as Markdown
      </a>

      {installSkillsHref && (
        <>
          <span className={sep} aria-hidden>|</span>
          <a href={installSkillsHref} className={btn}>
            <LightbulbIcon />
            Install skills
          </a>
        </>
      )}
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" strokeLinejoin="round" />
    </svg>
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

function LightbulbIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8C7.21 13.16 6 11.22 6 9a6 6 0 016-6z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
