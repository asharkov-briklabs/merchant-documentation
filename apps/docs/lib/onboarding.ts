import { trackEvent } from "./analytics";

// Ordered list of doc URLs that form the quickstart onboarding funnel.
// Must match pages that have `quickstartStep: true` in their frontmatter.
// Step index is derived from position in this array.
export const QUICKSTART_STEPS = [
  "/docs/getting-started/quick-start",
  "/docs/getting-started/account-setup",
  "/docs/getting-started/authentication",
  "/docs/getting-started/integration-overview",
  "/docs/getting-started/test-mode",
] as const;

const STORAGE_KEY = "vinr_onboarding";

interface OnboardingState {
  completedSteps: string[];
  firstSeenAt: number | null;
  completedAt: number | null;
}

function readState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedSteps: [], firstSeenAt: null, completedAt: null };
    return JSON.parse(raw) as OnboardingState;
  } catch {
    return { completedSteps: [], firstSeenAt: null, completedAt: null };
  }
}

function writeState(state: OnboardingState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or blocked — tracking is best-effort
  }
}

export function getOnboardingState(): OnboardingState {
  return readState();
}

export function markStepSeen(url: string): void {
  const stepIndex = QUICKSTART_STEPS.indexOf(url as (typeof QUICKSTART_STEPS)[number]);
  if (stepIndex === -1) return;

  const state = readState();
  const now = Date.now();

  const alreadySeen = state.completedSteps.includes(url);
  if (!alreadySeen) {
    state.completedSteps.push(url);
    state.firstSeenAt ??= now;
  }

  const total = QUICKSTART_STEPS.length;
  const done = QUICKSTART_STEPS.filter((s) => state.completedSteps.includes(s)).length;

  trackEvent("quickstart_step_view", {
    step_index: stepIndex + 1,
    total_steps: total,
    step_url: url,
    already_seen: alreadySeen,
  });

  if (!alreadySeen) {
    trackEvent("quickstart_progress", {
      step_index: stepIndex + 1,
      total_steps: total,
      steps_done: done,
      pct_complete: Math.round((done / total) * 100),
    });
  }

  if (done === total && !state.completedAt) {
    state.completedAt = now;
    const timeMs = state.firstSeenAt ? now - state.firstSeenAt : null;
    trackEvent("quickstart_complete", {
      time_to_complete_ms: timeMs,
    });
  }

  writeState(state);
}
