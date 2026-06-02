"use client";

import { useEffect } from "react";
import { markStepSeen } from "@/lib/onboarding";

// Fires quickstart funnel events for the current page. Empty deps are correct:
// this component lives in a server-component page, so it remounts on each
// navigation — one effect execution per page visit is exactly what we want.
export function QuickstartTracker() {
  useEffect(() => {
    markStepSeen(window.location.pathname);
  }, []);

  return null;
}
