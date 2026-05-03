interface LiveTickerProps {
  label: string;
  className?: string;
}

const TICKER_ITEMS = [
  { dot: "green", amt: "EUR 2,500.00", rest: " · Visa card · accepted" },
  { dot: "teal",  amt: "USD 840.00",   rest: " · Apple Pay · settled" },
  { dot: "green", amt: "GBP 1,120.50", rest: " · Bank transfer · confirmed" },
  { dot: "teal",  amt: "EUR 340.00",   rest: " · Klarna · authorized" },
  { dot: "green", amt: "USD 12,000.00",rest: " · ACH · settled" },
  { dot: "gray",  amt: "JPY 148,000",  rest: " · Local rail · pending" },
  { dot: "green", amt: "EUR 180.00",   rest: " · SEPA · confirmed" },
] as const;

const DOT_STYLES = {
  green: {
    bg: "#6da544",
    shadow: "0 0 6px rgba(109,165,68,0.6)",
  },
  teal: {
    bg: "#2a9d90",
    shadow: "0 0 6px rgba(42,157,144,0.6)",
  },
  gray: {
    bg: "#d2d6d7",
    shadow: "none",
  },
} as const;

export function LiveTicker({ label, className }: LiveTickerProps) {
  const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className={["flex items-center gap-4 mb-3", className].filter(Boolean).join(" ")}>
      <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.06em] text-[#2a9d90]">
        {label}
      </span>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex gap-6 w-max"
          style={{ animation: "tickerScroll 28s linear infinite" }}
        >
          {allItems.map((item, i) => {
            const dotStyle = DOT_STYLES[item.dot];
            return (
              <span
                key={i}
                className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] text-white/45"
              >
                <span
                  className="h-[6px] w-[6px] shrink-0 rounded-full"
                  style={{ background: dotStyle.bg, boxShadow: dotStyle.shadow }}
                />
                <span className="font-medium text-white/75">{item.amt}</span>
                {item.rest}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
