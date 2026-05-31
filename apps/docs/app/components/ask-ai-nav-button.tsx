"use client";

import { ChatBubbleIcon } from "./chat-bubble-icon";

interface AskAiNavButtonProps {
  label: string;
  active?: boolean;
}

export function AskAiNavButton({ label, active }: AskAiNavButtonProps) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("ask-ai:open", { detail: { message: "" } }));
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-vinr-500/40 px-3.5 text-[13px] font-medium text-vinr-50 transition-colors duration-[120ms]",
        active
          ? "bg-vinr-500/[0.38]"
          : "bg-vinr-500/25 hover:bg-vinr-500/[0.38]",
      ].join(" ")}
    >
      <ChatBubbleIcon className="h-[13px] w-[13px]" strokeWidth={1.8} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
