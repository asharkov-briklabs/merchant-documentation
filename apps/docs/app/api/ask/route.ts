import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";

// Rate limiting (in-memory for Phase 1)
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

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// System prompt for the VINR docs assistant
const SYSTEM_PROMPT = `You are the VINR Documentation Assistant — an AI that helps merchants understand and integrate with the VINR payment platform.

Your role:
- Answer questions about VINR's payment platform, APIs, integration guides, compliance requirements, and operations.
- Cite documentation sources when possible (link to relevant docs pages).
- Detect the user's persona (developer, finance manager, operations, compliance officer, business owner) and adapt your language accordingly.
- If you don't know the answer, say so clearly and suggest where they might find it or recommend contacting support.

Guidelines:
- Be concise, accurate, and helpful.
- Use code examples for developer-facing questions.
- Explain financial/compliance concepts in plain language for non-technical users.
- Never make up API endpoints, pricing, or compliance requirements.
- Always recommend consulting official VINR documentation for critical compliance decisions.

Persona inference:
- If the question involves code, SDKs, or API calls → developer tone
- If the question involves fees, settlements, or reconciliation → finance tone
- If the question involves KYC, AML, PCI → compliance tone
- If the question involves dashboards, monitoring, or alerts → operations tone
- If the question involves pricing, contracts, or strategy → business owner tone`;

export async function POST(req: NextRequest) {
  const key = getRateLimitKey(req);

  if (!checkRateLimit(key)) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Please try again later.",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: 2048,
  });

  return result.toDataStreamResponse();
}
