"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function DocsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2] dark:bg-[#4d1703]">
        <svg
          className="h-5 w-5 text-[#a2001d] dark:text-[#fecaca]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <h2 className="mt-3 text-base font-semibold text-fd-foreground">
        Failed to load this page
      </h2>
      <p className="mt-1.5 max-w-xs text-center text-sm text-fd-muted-foreground">
        There was a problem rendering this documentation page.
      </p>
      <div className="mt-5 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-vinr-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-vinr-800"
        >
          Retry
        </button>
        <Link
          href="/docs"
          className="rounded-lg border border-fd-border px-3.5 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
        >
          Back to Docs
        </Link>
      </div>
    </div>
  );
}
