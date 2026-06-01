import { readFileSync } from "node:fs";
import { join } from "node:path";
import { source } from "@/lib/source";

/**
 * Lightweight, dependency-free retrieval over the docs content, used to ground
 * the Ask-AI assistant so it cites real pages instead of hallucinating.
 *
 * We don't have (or need) a vector DB here: the corpus is ~160 short docs, so a
 * keyword overlap score against the plain-text body is fast and good enough.
 * The index is built once per server process from the raw `.mdx` files on disk
 * — `source.getPages()` gives us the canonical URL/title per page, but its
 * `body` is a compiled React component, not text, so we read the source files.
 *
 * Runs on the Node.js runtime only (filesystem access) — the consuming route
 * must declare `export const runtime = "nodejs"`.
 */

export interface DocChunk {
  url: string;
  title: string;
  description: string;
  text: string;
}

export interface RetrievedDoc {
  url: string;
  title: string;
  excerpt: string;
}

const CONTENT_DIR = join(process.cwd(), "content", "docs");

/** Strip frontmatter, imports/exports, JSX tags, and markdown punctuation. */
function toPlainText(raw: string): string {
  return raw
    .replace(/^---\n[\s\S]*?\n---\n/, "") // frontmatter
    .replace(/^(import|export)\s.*$/gm, "") // MDX import/export lines
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/<[^>]+>/g, " ") // JSX/HTML tags
    .replace(/[#>*_`|~\-]+/g, " ") // markdown punctuation
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/\s+/g, " ")
    .trim();
}

let indexCache: DocChunk[] | null = null;

function getIndex(): DocChunk[] {
  if (indexCache) return indexCache;
  const chunks: DocChunk[] = [];
  const failedPaths: string[] = [];
  const pages = source.getPages();
  for (const page of pages) {
    try {
      const raw = readFileSync(join(CONTENT_DIR, page.path), "utf8");
      chunks.push({
        url: page.url,
        title: page.data.title ?? "",
        description: page.data.description ?? "",
        text: toPlainText(raw),
      });
    } catch {
      // A page without a readable source file just isn't retrievable; skip it
      // rather than failing the whole assistant.
      failedPaths.push(page.path);
    }
  }

  // Loud failure, NOT silent: if pages exist but NONE of their source files
  // could be read, the `content/` tree almost certainly wasn't bundled into the
  // serverless function (Vercel file-tracing gap — see `outputFileTracingIncludes`
  // in next.config.mjs). Without this signal the assistant degrades to an
  // ungrounded, hallucination-prone model with no visible error. Log to stderr
  // (surfaces in Vercel logs + Sentry's console integration) so it's caught in
  // a preview deploy rather than in front of users.
  if (pages.length > 0 && chunks.length === 0) {
    console.error(
      `[docs-retrieval] Built an EMPTY index: ${pages.length} pages known but 0 source files readable from ${CONTENT_DIR}. ` +
        `The docs content was likely not bundled into this function — Ask-AI is now ungrounded. ` +
        `Check outputFileTracingIncludes/outputFileTracingRoot in next.config.mjs.`
    );
  } else if (failedPaths.length > 0) {
    console.warn(
      `[docs-retrieval] ${failedPaths.length}/${pages.length} doc source files were unreadable and excluded from retrieval: ` +
        failedPaths.slice(0, 10).join(", ") +
        (failedPaths.length > 10 ? ", …" : "")
    );
  }

  indexCache = chunks;
  return chunks;
}

function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => w.length > 2);
}

/** Build a short excerpt centered on the first query-term hit. */
function excerpt(text: string, terms: string[], len = 500): string {
  const lower = text.toLowerCase();
  let at = -1;
  for (const term of terms) {
    const i = lower.indexOf(term);
    if (i !== -1 && (at === -1 || i < at)) at = i;
  }
  const start = at === -1 ? 0 : Math.max(0, at - 120);
  const slice = text.slice(start, start + len).trim();
  return (start > 0 ? "…" : "") + slice + (start + len < text.length ? "…" : "");
}

/**
 * Return the docs most relevant to `query`, ranked by keyword overlap (title
 * matches weighted higher). Empty array when nothing matches.
 */
export function retrieveDocs(query: string, limit = 5): RetrievedDoc[] {
  const terms = Array.from(new Set(tokenize(query)));
  if (terms.length === 0) return [];

  const scored = getIndex().map((chunk) => {
    const haystack = chunk.text.toLowerCase();
    const titleHay = `${chunk.title} ${chunk.description}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (titleHay.includes(term)) score += 5;
      const matches = haystack.split(term).length - 1;
      score += Math.min(matches, 5); // cap per-term so one doc can't dominate
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ chunk }) => ({
      url: chunk.url,
      title: chunk.title,
      excerpt: excerpt(chunk.text, terms),
    }));
}
