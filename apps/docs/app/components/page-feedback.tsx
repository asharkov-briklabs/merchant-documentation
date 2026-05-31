"use client";

import { useState } from "react";

/**
 * "Was this page helpful?" widget (the docs.stripe.com pattern). A Yes/No vote
 * posts immediately to /api/feedback; choosing No additionally reveals an
 * optional free-text box. Styled with `--fd-*` tokens so it reads correctly on
 * both the light docs pages and the dark /api-reference screen.
 */
export function PageFeedback({ url }: { url: string }) {
  const [state, setState] = useState<"idle" | "down" | "done">("idle");
  const [comment, setComment] = useState("");

  function send(payload: { vote?: "up" | "down"; comment?: string }) {
    // Fire-and-forget: a failed vote shouldn't surface an error to the reader.
    fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, ...payload }),
      keepalive: true,
    }).catch(() => {});
  }

  if (state === "done") {
    return (
      <div className="not-prose mt-12 border-t border-fd-border pt-5 text-[13.5px] text-fd-muted-foreground">
        Thanks for your feedback!
      </div>
    );
  }

  return (
    <div className="not-prose mt-12 border-t border-fd-border pt-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[13.5px] font-medium text-fd-foreground">
          Was this page helpful?
        </span>
        <div className="flex items-center gap-1.5">
          <VoteButton
            label="Yes"
            onClick={() => {
              send({ vote: "up" });
              setState("done");
            }}
          >
            <ThumbIcon />
          </VoteButton>
          <VoteButton
            label="No"
            active={state === "down"}
            onClick={() => {
              send({ vote: "down" });
              setState("down");
            }}
          >
            <ThumbIcon down />
          </VoteButton>
        </div>
      </div>

      {state === "down" && (
        <form
          className="mt-3 max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            if (comment.trim()) send({ comment });
            setState("done");
          }}
        >
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="What's missing or wrong? (optional)"
            className="w-full resize-y rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-[13.5px] text-fd-foreground placeholder:text-fd-muted-foreground focus:border-vinr-500 focus:outline-none focus:ring-1 focus:ring-vinr-500/30"
          />
          <button
            type="submit"
            className="mt-2 inline-flex h-8 items-center rounded-md bg-vinr-500 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-vinr-600"
          >
            Send feedback
          </button>
        </form>
      )}
    </div>
  );
}

function VoteButton({
  label,
  children,
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        "inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium transition-colors",
        active
          ? "border-vinr-500/50 bg-vinr-500/10 text-fd-foreground"
          : "border-fd-border text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground",
      ].join(" ")}
    >
      {children}
      {label}
    </button>
  );
}

function ThumbIcon({ down }: { down?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={down ? "rotate-180" : ""}
    >
      <path
        d="M7 10v11M2 21h4V10H2v11zM7 10l4-7c1.5 0 2.5 1 2.5 2.5V9h5.5c1.1 0 1.9 1 1.6 2l-1.7 7c-.2.9-1 1.5-1.9 1.5H7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
