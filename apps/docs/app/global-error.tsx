"use client";

// Catches errors thrown in the root layout / rendering that the per-route
// error.tsx can't reach, and reports them to Sentry. Must render its own
// <html>/<body> because it replaces the root layout when it fires.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          gap: "0.75rem",
          padding: "1rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          Something went wrong
        </h2>
        <p style={{ maxWidth: "24rem", color: "#666", fontSize: "0.875rem" }}>
          An unexpected error occurred. Please reload the page or contact support
          if the issue persists.
        </p>
      </body>
    </html>
  );
}
