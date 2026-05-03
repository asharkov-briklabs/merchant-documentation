export function CodeCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-white/[0.04] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-3">
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="h-[10px] w-[10px] rounded-full bg-white/[0.15]" />
        <span className="ml-2 font-mono text-[11px] text-white/35">create-payment.ts</span>
      </div>

      <div className="p-5">
        <pre className="font-mono text-[13px] leading-[1.7]">
          <code>
            <span style={{ color: "#7dd3fc" }}>const</span>
            {" "}
            <span style={{ color: "#f7fdfc" }}>payment</span>
            {" "}
            <span style={{ color: "rgba(247,253,252,0.5)" }}>=</span>
            {" "}
            <span style={{ color: "#7dd3fc" }}>await</span>
            {" "}
            <span style={{ color: "#f7fdfc" }}>vinr</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>.</span>
            <span style={{ color: "#6ee7b7" }}>payments</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>.</span>
            <span style={{ color: "#6ee7b7" }}>create</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>{`({`}</span>
            {"\n"}
            {"  "}
            <span style={{ color: "#f7fdfc" }}>amount</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>:</span>
            {" "}
            <span style={{ color: "#f9a8d4" }}>2500</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>,</span>
            {"\n"}
            {"  "}
            <span style={{ color: "#f7fdfc" }}>currency</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>:</span>
            {" "}
            <span style={{ color: "#fde68a" }}>&quot;EUR&quot;</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>,</span>
            {"\n"}
            {"  "}
            <span style={{ color: "#f7fdfc" }}>method</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>:</span>
            {" "}
            <span style={{ color: "#fde68a" }}>&quot;card&quot;</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>,</span>
            {"\n"}
            {"  "}
            <span style={{ color: "#f7fdfc" }}>description</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>:</span>
            {" "}
            <span style={{ color: "#fde68a" }}>&quot;Order #4821&quot;</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>,</span>
            {"\n"}
            {"  "}
            <span style={{ color: "#f7fdfc" }}>returnUrl</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>:</span>
            {" "}
            <span style={{ color: "#fde68a" }}>&quot;https://shop.co/complete&quot;</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>,</span>
            {"\n"}
            <span style={{ color: "rgba(247,253,252,0.5)" }}>{`});`}</span>
            {"\n\n"}
            <span style={{ color: "rgba(247,253,252,0.3)", fontStyle: "italic" }}>
              {`// Redirect to checkout`}
            </span>
            {"\n"}
            <span style={{ color: "#6ee7b7" }}>redirect</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>(</span>
            <span style={{ color: "#f7fdfc" }}>payment</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>.</span>
            <span style={{ color: "#f7fdfc" }}>checkoutUrl</span>
            <span style={{ color: "rgba(247,253,252,0.5)" }}>);</span>
          </code>
        </pre>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.07] px-4 py-2.5">
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#6da544]">
          <span
            className="h-[6px] w-[6px] rounded-full bg-[#6da544]"
            style={{
              boxShadow: "0 0 6px rgba(109,165,68,0.7)",
              animation: "pulseDot 2s infinite",
            }}
          />
          payment.status: &quot;authorized&quot;
        </div>
        <span className="font-mono text-[11px] text-white/30">142 ms</span>
      </div>
    </div>
  );
}
