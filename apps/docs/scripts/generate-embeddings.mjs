/**
 * Build-time script: chunk all MDX docs, embed them with OpenAI text-embedding-3-small,
 * and write a pre-built index to disk.
 *
 * Run via:  pnpm --filter @vinr/docs generate:embeddings
 * Called automatically by prebuild and predev hooks.
 *
 * Output path: EMBEDDINGS_INDEX_PATH env var, or .embeddings/index.json by default.
 * The retrieval module reads from the same env var at runtime — keep them in sync.
 *
 * Requires OPENAI_API_KEY. If unset, the script soft-exits with a warning so
 * local dev without the key still works (retrieval degrades to empty results).
 */

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, renameSync } from "node:fs";
import { join, relative, extname } from "node:path";
import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

if (!process.env.OPENAI_API_KEY) {
  console.warn(
    "[generate-embeddings] OPENAI_API_KEY is not set — skipping embedding generation.\n" +
    "  The Ask-AI assistant will return empty results until the index is built.\n" +
    "  Set OPENAI_API_KEY and re-run: pnpm --filter @vinr/docs generate:embeddings"
  );
  process.exit(0);
}

const MODEL = "text-embedding-3-small";
const DIMS = 1536;
const MIN_CHUNK_CHARS = 80;
const EXCERPT_LEN = 500;

const root = join(new URL(".", import.meta.url).pathname, "..");
const contentDir = join(root, "content", "docs");
// EMBEDDINGS_INDEX_PATH lets any runtime (Next.js, Express, etc.) point to wherever
// the index lives. Default is .embeddings/index.json — a neutral, framework-agnostic dir.
const outputPath = process.env.EMBEDDINGS_INDEX_PATH ?? join(root, ".embeddings", "index.json");
const outputDir = join(outputPath, "..");
const tmpPath = outputPath + ".tmp";

// ─── File walking ────────────────────────────────────────────────────────────

function walkMdx(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walkMdx(full, results);
    } else if (extname(entry) === ".mdx") {
      results.push(full);
    }
  }
  return results;
}

// ─── Frontmatter parsing ─────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return { title: "", description: "", body: raw };
  const fm = match[1];
  const body = raw.slice(match[0].length);
  const title = (fm.match(/^title:\s*["']?(.+?)["']?\s*$/m) ?? [])[1] ?? "";
  const description = (fm.match(/^description:\s*["']?(.+?)["']?\s*$/m) ?? [])[1] ?? "";
  return { title: title.trim(), description: description.trim(), body };
}

// ─── Plain-text extraction (same approach as the old docs-retrieval.ts) ──────

function toPlainText(raw) {
  return raw
    .replace(/^(import|export)\s.*$/gm, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`|~\-]+/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── URL derivation ──────────────────────────────────────────────────────────

function fileToUrl(absPath) {
  const rel = relative(contentDir, absPath); // e.g. "payments/3d-secure.mdx"
  const withoutExt = rel.replace(/\.mdx$/, ""); // "payments/3d-secure"
  const normalized = withoutExt.replace(/\/index$/, ""); // strip trailing /index
  return "/docs/" + normalized;
}

// ─── Chunking by H2 headings ─────────────────────────────────────────────────

function chunkBody(body) {
  // Split so each piece starts with "## " (or is the intro before first ##)
  const parts = body.split(/(?=^## )/m);
  return parts.map((part) => {
    const headingMatch = part.match(/^## (.+)/);
    const heading = headingMatch ? headingMatch[1].trim() : null;
    const text = toPlainText(part);
    return { heading, text };
  });
}

// ─── Excerpt: first EXCERPT_LEN chars of plain text ──────────────────────────

function makeExcerpt(text) {
  const trimmed = text.slice(0, EXCERPT_LEN).trim();
  return text.length > EXCERPT_LEN ? trimmed + "…" : trimmed;
}

// ─── Unit-normalize a vector ─────────────────────────────────────────────────

function normalize(v) {
  const mag = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  return mag > 0 ? v.map((x) => x / mag) : v;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const files = walkMdx(contentDir);
console.log(`[generate-embeddings] Found ${files.length} MDX files`);

const chunks = [];

for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const { title, description, body } = parseFrontmatter(raw);
  const url = fileToUrl(file);
  const pageTitle = title || url.split("/").pop() || url;

  const sections = chunkBody(body);
  for (const { heading, text } of sections) {
    if (text.length < MIN_CHUNK_CHARS) continue;
    chunks.push({
      url,
      title: pageTitle,
      heading: heading ?? null,
      excerpt: makeExcerpt(text),
      // inputText is only used during embedding generation — not stored in the index
      inputText: `Title: ${pageTitle}\nSection: ${heading ?? "Overview"}\n${text}`,
    });
  }
}

console.log(`[generate-embeddings] Generated ${chunks.length} chunks`);

if (chunks.length === 0) {
  console.error("[generate-embeddings] No chunks produced — check content directory.");
  process.exit(1);
}

// ─── Embed ───────────────────────────────────────────────────────────────────

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

console.log(`[generate-embeddings] Calling OpenAI embeddings API (${MODEL})…`);
const t0 = Date.now();

const { embeddings } = await embedMany({
  model: openai.embedding(MODEL),
  values: chunks.map((c) => c.inputText),
  maxRetries: 3,
});

console.log(`[generate-embeddings] Received ${embeddings.length} embeddings in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

// ─── Build index ─────────────────────────────────────────────────────────────

const indexChunks = chunks.map((c, i) => ({
  url: c.url,
  title: c.title,
  heading: c.heading,
  excerpt: c.excerpt,
  embedding: normalize(embeddings[i]),
}));

const index = {
  version: 1,
  model: MODEL,
  dims: DIMS,
  generatedAt: new Date().toISOString(),
  chunks: indexChunks,
};

// ─── Write atomically ────────────────────────────────────────────────────────

mkdirSync(outputDir, { recursive: true });
const json = JSON.stringify(index);
writeFileSync(tmpPath, json, "utf8");
renameSync(tmpPath, outputPath);

const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(1);
console.log(
  `[generate-embeddings] Wrote ${outputPath} (${sizeMB} MB, ${indexChunks.length} chunks)`
);
