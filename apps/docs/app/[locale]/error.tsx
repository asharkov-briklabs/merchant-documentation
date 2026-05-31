"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fee2e2] dark:bg-[#4d1703]">
        <svg
          className="h-6 w-6 text-[#a2001d] dark:text-[#fecaca]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-fd-foreground">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-sm text-center text-sm text-fd-muted-foreground">
        An unexpected error occurred. Please try again or contact support if the
        issue persists.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-vinr-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-vinr-800"
      >
        Try again
      </button>
    </div>
  );
}
