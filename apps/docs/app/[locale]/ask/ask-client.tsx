"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import brandmarkDark from "../assets/Brandmark_Vinr_dark.svg";
import brandmarkLight from "../assets/Brandmark_Vinr_light.svg";
import { SiteNav } from "../components/site-nav";
import type { getTranslations } from "@/lib/translations";

export function AskClient({ t, locale }: { t: ReturnType<typeof getTranslations>; locale: string }) {
  const suggestions = [
    t.askSuggestion1,
    t.askSuggestion2,
    t.askSuggestion3,
    t.askSuggestion4,
  ];

  const { messages, input, handleInputChange, handleSubmit, isLoading, error, reload, stop } =
    useChat({
      api: "/api/ask",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasSentMessage, setHasSentMessage] = useState(false);

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
      setHasSentMessage(true);
      handleSubmit(e);
    },
    [input, isLoading, handleSubmit]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
      }
    },
    [onSubmit]
  );

  const selectSuggestion = useCallback(
    (suggestion: string) => {
      const event = {
        target: { value: suggestion },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(event);
      // Focus the textarea so user can just hit Enter
      textareaRef.current?.focus();
    },
    [handleInputChange]
  );

  return (
    <main className="flex h-screen flex-col bg-fd-background">
      {/* Dark Nav */}
      <SiteNav t={t} locale={locale} activeKey="ask" />

      {/* Conversation Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Empty State */}
        {messages.length === 0 && !hasSentMessage && (
          <div className="flex h-full flex-col items-center justify-center px-4 pb-32">
            {/* AI Avatar */}
            <div className="relative mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-vinr-100 to-vinr-200 shadow-sm dark:from-vinr-900 dark:to-vinr-800">
                <Image src={brandmarkLight} alt="" width={28} height={28} className="dark:hidden" />
                <Image src={brandmarkDark} alt="" width={28} height={28} className="hidden dark:block" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-fd-background bg-vinr-500" />
            </div>

            <h1 className="text-lg font-semibold text-fd-foreground">
              {t.askTitle}
            </h1>
            <p className="mt-1.5 max-w-sm text-center text-sm text-fd-muted-foreground">
              {t.askSubtitle}
            </p>

            {/* Suggestion Pills */}
            <div className="mt-8 flex max-w-xl flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => selectSuggestion(s)}
                  className="rounded-full border border-fd-border px-4 py-2 text-[13px] text-fd-muted-foreground transition-all hover:border-vinr-500 hover:bg-vinr-50 hover:text-fd-foreground dark:hover:border-vinr-500 dark:hover:bg-vinr-900"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className="group">
                  {message.role === "user" ? (
                    /* User message — right-aligned, compact */
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-vinr-700 px-4 py-2.5 text-sm text-white dark:bg-vinr-500">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    /* Assistant message — full width, clean */
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-vinr-100 to-vinr-200 dark:from-vinr-900 dark:to-vinr-800">
                        <Image src={brandmarkLight} alt="" width={14} height={14} className="dark:hidden" />
                        <Image src={brandmarkDark} alt="" width={14} height={14} className="hidden dark:block" />
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="prose prose-sm max-w-none text-fd-foreground prose-p:leading-relaxed prose-pre:bg-fd-muted prose-pre:text-fd-foreground prose-code:text-vinr-700 prose-code:before:content-none prose-code:after:content-none dark:prose-code:text-vinr-300">
                          <ReactMarkdown
                            components={{
                              code({ children, className }) {
                                const isInline = !className;
                                if (isInline) {
                                  return (
                                    <code className="rounded bg-fd-muted px-1.5 py-0.5 text-[13px]">
                                      {children}
                                    </code>
                                  );
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
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {/* Message actions (visible on hover) */}
                        <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => navigator.clipboard.writeText(message.content)}
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
              ))}

              {/* Streaming indicator */}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-vinr-100 to-vinr-200 dark:from-vinr-900 dark:to-vinr-800">
                    <Image src={brandmarkLight} alt="" width={14} height={14} className="dark:hidden" />
                    <Image src={brandmarkDark} alt="" width={14} height={14} className="hidden dark:block" />
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
                <div className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fee2e2] dark:bg-[#4d1703]">
                    <svg className="h-4 w-4 text-[#a2001d] dark:text-[#fecaca]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm text-[#a2001d] dark:text-[#fecaca]">
                      {error.message || "Something went wrong. Please try again."}
                    </p>
                    <button
                      onClick={() => reload()}
                      className="mt-1.5 text-xs font-medium text-vinr-700 hover:text-vinr-900 dark:text-vinr-300 dark:hover:text-vinr-200"
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

      {/* Input Area — floating card style */}
      <div className="shrink-0 px-4 pb-4 pt-2">
        <form
          onSubmit={onSubmit}
          className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-vinr-500/20"
        >
          <div className="flex items-end gap-2 px-4 py-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t.askPlaceholder}
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
          <div className="flex items-center justify-between border-t border-fd-border/50 px-4 py-1.5">
            <p className="text-[11px] text-fd-muted-foreground">
              {t.askDisclaimer}
            </p>
            <span className="hidden text-[11px] text-fd-muted-foreground/60 sm:inline">
              Enter ↵ to send · Shift+Enter for newline
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}
