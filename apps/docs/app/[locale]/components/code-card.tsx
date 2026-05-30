"use client";

import { useState } from "react";
import type { getTranslations } from "@/lib/translations";

type T = ReturnType<typeof getTranslations>;

interface Tab {
  key: string;
  labelKey: keyof T;
  file: string;
  code: string;
  status: string;
  ms: string;
}

const TABS: Tab[] = [
  {
    key: "payment",
    labelKey: "codeTabPayment",
    file: "create-payment.ts",
    code: `const payment = await vinr.payments.create({
  amount: 2500,
  currency: "EUR",
  method: "card",
  description: "Order #4821",
  returnUrl: "https://shop.co/complete",
});

// Redirect to checkout
redirect(payment.checkoutUrl);`,
    status: 'payment.status: "authorized"',
    ms: "142 ms",
  },
  {
    key: "points",
    labelKey: "codeTabPoints",
    file: "issue-points.ts",
    code: `const result = await vinr.loyalty.points.issue({
  customer: "cus_8Kd92",
  points: 150,
  reason: "purchase",
  reference: "order_4821",
});

// New balance returned
console.log(result.balance);`,
    status: "points.balance: 1850",
    ms: "88 ms",
  },
  {
    key: "reward",
    labelKey: "codeTabReward",
    file: "redeem-reward.ts",
    code: `const redemption = await vinr.rewards.redeem({
  customer: "cus_8Kd92",
  reward: "rwd_freeShip",
  points: 500,
});

// Apply at checkout
applyDiscount(redemption.code);`,
    status: 'redemption.status: "applied"',
    ms: "96 ms",
  },
];

const KEYWORDS = new Set(["const", "await", "return", "new", "let", "var"]);

const COLORS = {
  keyword: "#7dd3fc",
  call: "#6ee7b7",
  string: "#fde68a",
  number: "#f9a8d4",
  punct: "rgba(247,253,252,0.5)",
  comment: "rgba(247,253,252,0.3)",
  text: "#f7fdfc",
};

// Lightweight, dependency-free highlighter for the demo snippets.
function highlight(code: string) {
  return code.split("\n").map((line, li) => {
    if (line.trim().startsWith("//")) {
      return (
        <span key={li} style={{ color: COLORS.comment, fontStyle: "italic" }}>
          {line}
          {"\n"}
        </span>
      );
    }
    const tokens = line.match(/("(?:[^"\\]|\\.)*"|\b\d+\b|[a-zA-Z_$][\w$]*|\s+|[^\w\s]+)/g) ?? [];
    return (
      <span key={li}>
        {tokens.map((tok, ti) => {
          let color = COLORS.text;
          if (/^"/.test(tok)) color = COLORS.string;
          else if (/^\d+$/.test(tok)) color = COLORS.number;
          else if (/^\s+$/.test(tok)) color = COLORS.text;
          else if (/^[^\w\s]+$/.test(tok)) color = COLORS.punct;
          else if (KEYWORDS.has(tok)) color = COLORS.keyword;
          else {
            // Method/function call: followed by "(" or preceded by ".".
            const next = tokens[ti + 1] ?? "";
            const prev = tokens[ti - 1] ?? "";
            if (next.startsWith("(") || prev.endsWith(".")) color = COLORS.call;
          }
          return (
            <span key={ti} style={{ color }}>
              {tok}
            </span>
          );
        })}
        {"\n"}
      </span>
    );
  });
}

export function CodeCard({ t }: { t: T }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const tab = TABS[active];

  function copy() {
    navigator.clipboard?.writeText(tab.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.07] px-3 pt-2.5">
        {TABS.map((tb, i) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setActive(i)}
            className={[
              "rounded-t-md px-3 py-2 text-[12px] font-medium transition-colors",
              i === active
                ? "bg-white/[0.06] text-[#f7fdfc]"
                : "text-white/40 hover:text-white/70",
            ].join(" ")}
          >
            {t[tb.labelKey]}
          </button>
        ))}
      </div>

      {/* Filename + copy */}
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="ml-2 font-mono text-[11px] text-white/35">{tab.file}</span>
        <button
          type="button"
          onClick={copy}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-white/[0.1] px-2 py-1 text-[11px] text-white/45 transition-colors hover:border-[rgba(42,157,144,0.5)] hover:text-white/80"
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="5" width="8" height="8" rx="1.5" />
            <path d="M3 11V3.5A1.5 1.5 0 014.5 2H11" strokeLinecap="round" />
          </svg>
          {copied ? t.copiedLabel : t.copyLabel}
        </button>
      </div>

      {/* Code */}
      <div className="p-5">
        <pre className="overflow-x-auto font-mono text-[13px] leading-[1.7]">
          <code>{highlight(tab.code)}</code>
        </pre>
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6da544]">
          <span
            className="h-[6px] w-[6px] rounded-full bg-[#6da544]"
            style={{
              boxShadow: "0 0 6px rgba(109,165,68,0.7)",
              animation: "pulseDot 2s infinite",
            }}
          />
          {tab.status}
        </div>
        <span className="font-mono text-[11px] text-white/30">{tab.ms}</span>
      </div>
    </div>
  );
}
