import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { retrieveDocs, type RetrievedDoc } from "@/lib/docs-retrieval";
import { checkAskRateLimit } from "@/lib/rate-limit";
import { SITE_ORIGIN } from "@/lib/site-url";

// Needs the Node.js runtime: the retrieval index reads the .mdx files from disk.
export const runtime = "nodejs";

// Docs Q&A is well within Haiku's range; it's fast and cheap for streaming.
const MODEL = "claude-haiku-4-5-20251001";

function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

// First line of abuse defense: only allow browser requests from our own site.
// Blocks naive scripted abuse that hammers the endpoint cross-origin. We allow
// requests with no Origin header (non-browser clients) — the rate limiter still
// covers those — and permit localhost for dev. Additional hosts (custom
// domains, preview/staging deploys on any platform) are configured via the
// comma-separated ALLOWED_ORIGINS env var, e.g.
//   ALLOWED_ORIGINS=staging.example.com,*.preview.example.com
// A leading "*." entry matches that domain and any subdomain. The legacy
// VERCEL_URL / *.vercel.app hosts are still honored when present, so existing
// Vercel deploys keep working without extra config — but nothing requires them.
const SITE_HOST = new URL(SITE_ORIGIN).host;

const EXTRA_ALLOWED = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((h) => h.trim().toLowerCase())
  .filter(Boolean);

function matchesAllowed(host: string): boolean {
  return EXTRA_ALLOWED.some((pattern) => {
    if (pattern.startsWith("*.")) {
      const base = pattern.slice(2);
      return host === base || host.endsWith(`.${base}`);
    }
    return host === pattern;
  });
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  let host: string;
  try {
    host = new URL(origin).host.toLowerCase();
  } catch {
    return false;
  }
  if (host === SITE_HOST.toLowerCase()) return true;
  if (host === "localhost" || host.startsWith("localhost:")) return true;
  if (matchesAllowed(host)) return true;
  // Optional, platform-specific conveniences — only ever match on Vercel.
  if (process.env.VERCEL_URL && host === process.env.VERCEL_URL) return true;
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      })
    )
    .min(1)
    .max(50),
});

const BASE_SYSTEM_PROMPT = `You are the VINR Documentation Assistant — an AI that helps merchants understand and integrate with the VINR payment platform.

Your role:
- Answer questions about VINR's payment platform, APIs, integration guides, compliance requirements, and operations.
- Ground every answer in the documentation excerpts provided below, and cite the source pages by their URL (as markdown links) when you use them.
- Detect the user's persona (developer, finance manager, operations, compliance officer, business owner) and adapt your language accordingly.

Guidelines:
- Be concise, accurate, and helpful. Use code examples for developer-facing questions.
- If the provided documentation does not contain the answer, say so clearly and suggest contacting support or browsing the docs — do NOT invent API endpoints, pricing, or compliance requirements.
- Always recommend consulting official VINR documentation for critical compliance decisions.`;

function buildSystemPrompt(docs: RetrievedDoc[]): string {
  if (docs.length === 0) {
    return `${BASE_SYSTEM_PROMPT}\n\nNo documentation excerpts matched this question. If you cannot answer from general VINR knowledge, say you don't have that information and point the user to the docs or support.`;
  }
  const context = docs
    .map((d) => `### ${d.title}\nSource: ${d.url}\n${d.excerpt}`)
    .join("\n\n");
  return `${BASE_SYSTEM_PROMPT}\n\nRelevant documentation excerpts (cite these URLs):\n\n${context}`;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The assistant is not configured (missing API key)." },
      { status: 500 }
    );
  }

  if (!isAllowedOrigin(req)) {
    return Response.json({ error: "Forbidden." }, { status: 403 });
  }

  const limit = await checkAskRateLimit(getRateLimitKey(req));
  if (!limit.ok) {
    if (limit.reason === "global_cap") {
      // A real cost signal — the global daily ceiling was hit. Page-worthy.
      Sentry.captureMessage("Ask-AI global daily request cap reached", "warning");
      return Response.json(
        { error: "The assistant is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }
    return Response.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request: expected a non-empty messages array." },
      { status: 400 }
    );
  }

  const { messages } = parsed.data;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const docs = retrieveDocs(lastUser?.content ?? "");

  // Zero-result tracking: a question that retrieved no grounding is both a
  // hallucination risk and a "docs to write" signal (roadmap item 8). Capture
  // it as a Sentry event tagged with the (truncated) query.
  if (docs.length === 0 && lastUser?.content) {
    Sentry.captureMessage("Ask-AI retrieved 0 docs for query", {
      level: "info",
      tags: { feature: "ask-ai", zero_result: "true" },
      extra: { query: lastUser.content.slice(0, 200) },
    });
  }

  const result = streamText({
    model: anthropic(MODEL),
    system: buildSystemPrompt(docs),
    messages,
    maxTokens: 2048,
    onError: ({ error }) => {
      // Streaming/model errors surface here, not as a thrown POST exception —
      // without this they'd be invisible.
      Sentry.captureException(error, { tags: { feature: "ask-ai" } });
      console.error("[ask] streamText error:", error);
    },
  });

  return result.toDataStreamResponse();
}
