import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { z } from "zod";
import { retrieveDocs } from "@/lib/docs-retrieval";

// Needs the Node.js runtime: the retrieval index reads the .mdx files from disk.
export const runtime = "nodejs";

// Docs Q&A is well within Haiku's range; it's fast and cheap for streaming.
const MODEL = "claude-haiku-4-5-20251001";

// Best-effort, in-memory rate limiting. NOTE: this is per-instance and resets
// on cold starts, so it only throttles bursts hitting the same warm instance —
// it is NOT a durable limit. Move to a shared store (e.g. Upstash/Vercel KV)
// before relying on it for abuse protection.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10");
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");

function getRateLimitKey(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "anonymous"
  );
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
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

function buildSystemPrompt(query: string): string {
  const docs = retrieveDocs(query);
  if (docs.length === 0) {
    return `${BASE_SYSTEM_PROMPT}\n\nNo documentation excerpts matched this question. If you cannot answer from general VINR knowledge, say you don't have that information and point the user to the docs or support.`;
  }
  const context = docs
    .map(
      (d) => `### ${d.title}\nSource: ${d.url}\n${d.excerpt}`
    )
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

  if (!checkRateLimit(getRateLimitKey(req))) {
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

  const result = streamText({
    model: anthropic(MODEL),
    system: buildSystemPrompt(lastUser?.content ?? ""),
    messages,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
