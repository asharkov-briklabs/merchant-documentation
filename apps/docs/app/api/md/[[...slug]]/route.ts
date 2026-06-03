import { NextRequest } from "next/server";
import { source } from "@/lib/source";
import { pageToMarkdown } from "@/lib/raw-doc";
import { checkMdRateLimit } from "@/lib/rate-limit";

// Reads raw .mdx from disk → must run on the Node.js runtime. Dynamic so the
// handler executes per-request (the file read is cheap and cache-controlled).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serves any doc page's source as text/markdown — the target of the
 * "View as Markdown" action and the body the "Copy page" button fetches.
 * The `slug` mirrors the fumadocs content slug, e.g.
 *   /api/md/payments            → content/docs/payments.mdx
 *   /api/md/api-reference/refunds → content/docs/api-reference/refunds.mdx
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "anonymous";
  const limit = await checkMdRateLimit(ip);
  if (!limit.ok) return new Response("Rate limit exceeded.", { status: 429 });

  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) return new Response("Not found", { status: 404 });

  return new Response(await pageToMarkdown(page), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
