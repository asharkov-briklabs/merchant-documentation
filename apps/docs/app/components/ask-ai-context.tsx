"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AskAIContextValue {
  isOpen: boolean;
  initialMessage: string;
  open: (initialMessage?: string) => void;
  close: () => void;
}

const AskAIContext = createContext<AskAIContextValue | null>(null);

export function AskAIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  function open(msg = "") {
    setInitialMessage(msg);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <AskAIContext.Provider value={{ isOpen, initialMessage, open, close }}>
      {children}
    </AskAIContext.Provider>
  );
}

export function useAskAI() {
  const ctx = useContext(AskAIContext);
  if (!ctx) throw new Error("useAskAI must be used inside AskAIProvider");
  return ctx;
}
