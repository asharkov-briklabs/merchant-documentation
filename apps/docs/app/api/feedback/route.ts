// Receives "Was this page helpful?" votes from the <PageFeedback> widget.
// Node.js runtime so the structured log lands in the same stderr stream the
// rest of the server uses (picked up by log drains / Sentry's console
// integration). v1 intentionally has no datastore — wiring votes to a real
// analytics sink / table is a follow-up; the payload shape is stable for that.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FeedbackBody {
  url?: unknown;
  vote?: unknown;
  comment?: unknown;
}

export async function POST(req: Request) {
  let body: FeedbackBody;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const url = typeof body.url === "string" ? body.url : null;
  const vote = body.vote === "up" || body.vote === "down" ? body.vote : null;
  const comment =
    typeof body.comment === "string" && body.comment.trim()
      ? body.comment.trim().slice(0, 1000)
      : null;

  // A request must carry either a vote or a comment, and a page URL.
  if (!url || (!vote && !comment)) {
    return new Response("Missing url and vote/comment", { status: 400 });
  }

  console.log(
    JSON.stringify({
      type: "doc_feedback",
      url,
      vote,
      comment,
      at: new Date().toISOString(),
    }),
  );

  return new Response(null, { status: 204 });
}
