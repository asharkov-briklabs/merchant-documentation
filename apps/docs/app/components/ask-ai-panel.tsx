"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { getMessageText } from "@/lib/ui-message";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import brandmarkDark from "../assets/Brandmark_Vinr_dark.svg";
import brandmarkLight from "../assets/Brandmark_Vinr_light.svg";

const SUGGESTIONS = [
  "How do I integrate VINR payments?",
  "What payment methods are supported?",
  "How does settlement work?",
  "What are the compliance requirements?",
];

export function AskAIPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ message?: string }>).detail;
      setInitialMessage(detail?.message ?? "");
      setIsOpen(true);
    }
    window.addEventListener("ask-ai:open", onOpen);
    return () => window.removeEventListener("ask-ai:open", onOpen);
  }, []);

  const { messages, sendMessage, regenerate, stop, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ask" }),
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Track previous isOpen to detect the open transition and avoid overwriting
  // in-progress user input when the panel is triggered a second time while
  // already open.
  const wasOpenRef = useRef(false);

  // Pre-fill input only when the panel transitions from closed → open. Guarding
  // on the transition (not just isOpen) prevents the effect from overwriting
  // whatever the user is already typing if a second "Ask AI" action fires while
  // the panel is already visible.
  useEffect(() => {
    if (isOpen && !wasOpenRef.current && initialMessage) {
      setInput(initialMessage);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, initialMessage]);

  // Focus textarea after slide-in completes
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => textareaRef.current?.focus(), 310);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;
      sendMessage({ parts: [{ type: "text", text: input }] });
      setInput("");
    },
    [input, isLoading, sendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    },
    [onSubmit],
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal={isOpen}
        aria-label="Ask AI"
        aria-hidden={!isOpen}
        className={[
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col border-l border-fd-border bg-fd-background shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px]",
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-fd-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-vinr-100 to-vinr-200 dark:from-vinr-900 dark:to-vinr-800">
              <Image src={brandmarkLight} alt="" width={14} height={14} className="dark:hidden" />
              <Image src={brandmarkDark} alt="" width={14} height={14} className="hidden dark:block" />
            </div>
            <span className="text-sm font-semibold text-fd-foreground">
              Ask AI
            </span>
          </div>
          <button
            onClick={close}
            className="flex h-7 w-7 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center px-5 pb-16">
              <p className="text-center text-sm text-fd-muted-foreground">
                AI-powered assistant trained on VINR documentation. Ask about
                integration, payments, compliance, or operations.
              </p>
              <div className="mt-5 flex w-full flex-col gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                    className="rounded-lg border border-fd-border px-3.5 py-2.5 text-left text-[13px] text-fd-muted-foreground transition-all hover:border-vinr-500 hover:bg-vinr-50 hover:text-fd-foreground dark:hover:border-vinr-500 dark:hover:bg-vinr-900"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="px-4 py-4">
              <div className="space-y-5">
                {messages.map((message) => {
                  const text = getMessageText(message);
                  return (
                    <div key={message.id} className="group">
                      {message.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-2xl rounded-br-md bg-vinr-700 px-4 py-2.5 text-sm text-white dark:bg-vinr-500">
                            {text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2.5">
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-vinr-100 to-vinr-200 dark:from-vinr-900 dark:to-vinr-800">
                            <Image src={brandmarkLight} alt="" width={12} height={12} className="dark:hidden" />
                            <Image src={brandmarkDark} alt="" width={12} height={12} className="hidden dark:block" />
                          </div>
                          <div className="min-w-0 flex-1 pt-0.5">
                            <div className="prose prose-sm max-w-none text-fd-foreground prose-p:leading-relaxed prose-pre:bg-fd-muted prose-pre:text-fd-foreground prose-code:text-vinr-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:text-vinr-300">
                              <ReactMarkdown
                                components={{
                                  code({ children, className }) {
                                    const isInline = !className;
                                    if (isInline) {
                                      return <code className="rounded bg-fd-muted px-1.5 py-0.5 text-[13px]">{children}</code>;
                                    }
                                    return (
                                      <pre className="overflow-x-auto rounded-lg bg-fd-muted p-4">
                                        <code className="text-[13px]">{children}</code>
                                      </pre>
                                    );
                                  },
                                  a({ href, children }) {
                                    return (
                                      <a href={href} className="text-vinr-700 underline hover:text-vinr-900 dark:text-vinr-300 dark:hover:text-vinr-200" target="_blank" rel="noopener noreferrer">
                                        {children}
                                      </a>
                                    );
                                  },
                                }}
                              >
                                {text}
                              </ReactMarkdown>
                            </div>
                            <div className="mt-1.5 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => navigator.clipboard.writeText(text)}
                                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
                              >
                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                </svg>
                                Copy
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Streaming indicator */}
                {isLoading && (
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-vinr-100 to-vinr-200 dark:from-vinr-900 dark:to-vinr-800">
                      <Image src={brandmarkLight} alt="" width={12} height={12} className="dark:hidden" />
                      <Image src={brandmarkDark} alt="" width={12} height={12} className="hidden dark:block" />
                    </div>
                    <div className="flex items-center gap-1 pt-2">
                      <span className="h-2 w-2 animate-[bounce_1.4s_infinite_0s] rounded-full bg-vinr-500/60" />
                      <span className="h-2 w-2 animate-[bounce_1.4s_infinite_0.2s] rounded-full bg-vinr-500/60" />
                      <span className="h-2 w-2 animate-[bounce_1.4s_infinite_0.4s] rounded-full bg-vinr-500/60" />
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex gap-2.5">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fee2e2] dark:bg-[#4d1703]">
                      <svg className="h-3.5 w-3.5 text-[#a2001d] dark:text-[#fecaca]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm text-[#a2001d] dark:text-[#fecaca]">
                        {error.message || "Something went wrong. Please try again."}
                      </p>
                      <button
                        onClick={() => regenerate()}
                        className="mt-1 text-xs font-medium text-vinr-700 hover:text-vinr-900 dark:text-vinr-300"
                      >
                        Try again →
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 px-4 pb-4 pt-2">
          <form
            onSubmit={onSubmit}
            className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-vinr-500/20"
          >
            <div className="flex items-end gap-2 px-3.5 py-3">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about VINR..."
                rows={1}
                className="max-h-[200px] min-h-[24px] flex-1 resize-none bg-transparent text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none"
                disabled={isLoading}
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-fd-muted text-fd-muted-foreground transition-colors hover:bg-fd-accent"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-vinr-700 text-white transition-all hover:bg-vinr-800 disabled:bg-fd-muted disabled:text-fd-muted-foreground"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex items-center border-t border-fd-border/50 px-3.5 py-1.5">
              <p className="text-[11px] text-fd-muted-foreground">
                AI responses are generated from VINR documentation. Verify
                critical information before production use.
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
