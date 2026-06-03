import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { embed } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

/**
 * Semantic retrieval for the Ask-AI assistant using pre-built vector embeddings.
 *
 * The index is generated at build time by scripts/generate-embeddings.mjs and
 * loaded from disk at runtime. Index path is controlled by EMBEDDINGS_INDEX_PATH
 * (defaults to .embeddings/index.json relative to cwd). This keeps the retrieval
 * logic framework-agnostic — it runs in any Node.js server, not just Next.js.
 *
 * Requires OPENAI_API_KEY for query embedding at runtime.
 * Gracefully degrades to empty results when the key or index is absent.
 */

export interface RetrievedDoc {
  url: string;
  title: string;
  excerpt: string;
}

interface IndexChunk {
  url: string;
  title: string;
  heading: string | null;
  excerpt: string;
  embedding: number[];
}

interface EmbeddingsIndex {
  version: number;
  model: string;
  dims: number;
  generatedAt: string;
  chunks: IndexChunk[];
}

// EMBEDDINGS_INDEX_PATH lets the consuming server (Next.js, Express, etc.) point to
// wherever the index was written. Must match the path used in generate-embeddings.mjs.
const EMBEDDINGS_PATH =
  process.env.EMBEDDINGS_INDEX_PATH ?? join(process.cwd(), ".embeddings", "index.json");

let indexCache: EmbeddingsIndex | null = null;
// A single in-flight load promise so concurrent first requests don't double-read.
let loadPromise: Promise<EmbeddingsIndex | null> | null = null;

async function getIndex(): Promise<EmbeddingsIndex | null> {
  if (indexCache) return indexCache;
  if (loadPromise) return loadPromise;
  loadPromise = readFile(EMBEDDINGS_PATH, "utf8")
    .then((raw) => {
      const parsed = JSON.parse(raw) as EmbeddingsIndex;
      if (parsed.version !== 1 || parsed.dims !== 1536) {
        console.error(
          "[docs-retrieval] Embeddings index has unexpected version/dims — " +
          "run pnpm generate:embeddings to rebuild."
        );
        return null;
      }
      indexCache = parsed;
      console.log(`[docs-retrieval] Loaded embeddings index: ${parsed.chunks.length} chunks (${parsed.model})`);
      return indexCache;
    })
    .catch(() => {
      console.error(
        `[docs-retrieval] Could not load embeddings index from ${EMBEDDINGS_PATH}. ` +
        "Run pnpm generate:embeddings to build it. Ask-AI will return empty results."
      );
      return null;
    });
  return loadPromise;
}

function dotProduct(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

/**
 * Return the docs most relevant to `query`, ranked by semantic similarity.
 * Returns an empty array when the index or API key is missing (graceful degradation).
 */
export async function retrieveDocs(query: string, limit = 5): Promise<RetrievedDoc[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("[docs-retrieval] OPENAI_API_KEY not set — returning empty results.");
    return [];
  }

  const index = await getIndex();
  if (!index) return [];

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
    maxRetries: 2,
  });

  const scored = index.chunks.map((c) => ({ c, score: dotProduct(embedding, c.embedding) }));
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ c }) => ({
    url: c.url,
    title: c.heading ? `${c.title} — ${c.heading}` : c.title,
    excerpt: c.excerpt,
  }));
}
