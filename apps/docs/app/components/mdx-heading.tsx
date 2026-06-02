"use client";

import { isValidElement, useState, type ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Drop-in replacement for the MDX `h2`, adding Stripe-style per-section actions
 * (Ask about this section · Copy section) revealed on hover. It preserves the
 * pieces the rest of the page depends on: the heading `id` (TOC + deep links),
 * the `scroll-m-28` offset, and a hover anchor link — mirroring fumadocs'
 * built-in Heading so swapping it in changes nothing structural.
 *
 * "Copy section" fetches the page's Markdown (the /api/md endpoint) and slices
 * out this heading's section by matching the heading slug, falling back to the
 * whole page if the section can't be located.
 */
export function MdxHeading({
  id,
  children,
  pageTitle,
  markdownPath,
}: {
  id?: string;
  children?: ReactNode;
  pageTitle: string;
  markdownPath: string;
}) {
  const [copied, setCopied] = useState(false);

  // Headings without an id (rare) keep the plain rendering — no actions.
  if (!id) return <h2>{children}</h2>;

  const text = nodeText(children);
  const askHref = `/ask?q=${encodeURIComponent(`Explain the "${text}" section of the ${pageTitle} documentation.`)}`;

  async function copySection() {
    try {
      const res = await fetch(markdownPath);
      const md = await res.text();
      const content = sliceSection(md, id!) ?? md;
      await navigator.clipboard.writeText(content);
      trackEvent("code_copy", { slug: window.location.pathname, section: id });
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* non-fatal */
    }
  }

  return (
    <h2 id={id} className="group flex scroll-m-28 flex-row items-center gap-2">
      <a href={`#${id}`} className="peer">
        {children}
      </a>
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="size-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity peer-hover:opacity-100 group-hover:opacity-100"
      >
        <HashIcon />
      </a>

      <span className="ml-auto flex items-center gap-0.5 text-[12px] font-normal leading-none tracking-normal opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <Link href={askHref} className={actionCls}>
          <SparkleIcon />
          Ask
        </Link>
        <button
          type="button"
          onClick={copySection}
          className={actionCls}
          aria-label="Copy this section as Markdown"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Copy"}
        </button>
      </span>
    </h2>
  );
}

const actionCls =
  "inline-flex h-7 items-center gap-1 rounded-md px-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground";

/** Flatten React children to their text content. */
function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement(node)) return nodeText((node.props as { children?: ReactNode }).children);
  return "";
}

/** GitHub-style heading slug, close enough to fumadocs' rehype-slug output. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/** Slice the Markdown section whose heading matches `id`: heading line through
 *  the line before the next heading of the same or higher level. */
function sliceSection(md: string, id: string): string | null {
  const lines = md.split("\n");
  let start = -1;
  let level = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = /^(#{1,6})\s+(.*)$/.exec(lines[i]);
    if (m && slugify(m[2]) === id) {
      start = i;
      level = m[1].length;
      break;
    }
  }
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const m = /^(#{1,6})\s+/.exec(lines[i]);
    if (m && m[1].length <= level) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join("\n").trim();
}

function HashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 3L8 21M16 3l-2 18M4 8.5h16M3 15.5h16" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
