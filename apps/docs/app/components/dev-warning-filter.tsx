"use client";

import { useEffect } from "react";

// TODO: Delete this file once next-themes is React 19 compatible.
// Track: https://github.com/pacocoursey/next-themes/issues/269
//
// next-themes injects a <script> in its ThemeProvider ("use client") to set
// the theme class before hydration (anti-FOUC). React 19 warns when a <script>
// appears as a direct child of a non-<head> client component. Suppress only
// that specific message in dev so it doesn't drown out real warnings.
//
// The two strings below together uniquely identify this React 19 warning:
//   - "In HTML, <script> cannot be a child of" (the structural complaint)
//   - "ThemeProvider" (only next-themes' component triggers this in our tree)
// Any other component rendering a <script> will still surface normally.
export function DevWarningFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const original = console.error;
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === "string" ? args[0] : "";
      if (
        msg.includes("In HTML, <script> cannot be a child of") &&
        args.some((a) => typeof a === "string" && a.includes("ThemeProvider"))
      ) {
        return;
      }
      original(...args);
    };
    return () => {
      console.error = original;
    };
  }, []);

  return null;
}
