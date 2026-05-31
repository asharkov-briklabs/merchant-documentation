"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Stripe-style object property list for API reference pages. Replaces a flat
 * Markdown table: each field shows name · type · badges with a description, and
 * a field with nested `<Attributes>` gets an inline "Show child attributes"
 * expander.
 *
 * ```mdx
 * <Attributes>
 *   <Attribute name="id" type="string">Unique identifier.</Attribute>
 *   <Attribute name="customer" type="object" expandable>
 *     The customer charged.
 *     <Attributes>
 *       <Attribute name="id" type="string">Customer ID.</Attribute>
 *     </Attributes>
 *   </Attribute>
 * </Attributes>
 * ```
 *
 * A nested `<Attributes>` knows it's nested via React context (set by its parent
 * `<Attribute>`) rather than by comparing element types — referential identity
 * isn't reliable across the MDX/Server-Component boundary. Styling uses fumadocs
 * `--fd-*` tokens so it adapts to both the light docs pages and the dark
 * /api-reference screen.
 */

const NestedContext = createContext(false);

export function Attributes({ children }: { children: ReactNode }) {
  const nested = useContext(NestedContext);
  if (nested) return <NestedAttributes>{children}</NestedAttributes>;
  return (
    <div className="not-prose my-5 overflow-hidden rounded-xl border border-fd-border">
      <div className="divide-y divide-fd-border">{children}</div>
    </div>
  );
}

/** A child attribute group: collapsed by default, toggled inline. */
function NestedAttributes({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-2.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1 rounded-md text-[12.5px] font-medium text-vinr-500 transition-colors hover:text-vinr-600"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          className={open ? "rotate-90 transition-transform" : "transition-transform"}
        >
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {open ? "Hide child attributes" : "Show child attributes"}
      </button>
      {open && (
        <div className="mt-2 divide-y divide-fd-border border-l-2 border-fd-border pl-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface AttributeProps {
  name: string;
  type?: string;
  required?: boolean;
  expandable?: boolean;
  deprecated?: boolean;
  children?: ReactNode;
}

export function Attribute({
  name,
  type,
  required,
  expandable,
  deprecated,
  children,
}: AttributeProps) {
  return (
    <div className="px-3.5 py-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <code className="font-mono text-[13px] font-semibold text-fd-foreground">
          {name}
        </code>
        {type && (
          <span className="font-mono text-[12px] text-fd-muted-foreground">{type}</span>
        )}
        {required && <Badge tone="required">Required</Badge>}
        {expandable && <Badge tone="muted">Expandable</Badge>}
        {deprecated && <Badge tone="warn">Deprecated</Badge>}
      </div>
      {/* Description prose + any nested <Attributes>. The provider tells a
          nested group to render itself collapsed. */}
      <NestedContext.Provider value={true}>
        <div className="mt-1 text-[13.5px] leading-[1.6] text-fd-muted-foreground [&_a]:text-vinr-500 [&_a]:underline [&_code]:rounded [&_code]:bg-fd-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_p]:m-0">
          {children}
        </div>
      </NestedContext.Provider>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "required" | "muted" | "warn";
}) {
  const toneCls = {
    required: "border-vinr-500/40 text-vinr-500",
    muted: "border-fd-border text-fd-muted-foreground",
    warn: "border-yellow/50 text-yellow",
  }[tone];
  return (
    <span
      className={`rounded border px-1.5 py-px text-[10.5px] font-medium uppercase tracking-[0.03em] ${toneCls}`}
    >
      {children}
    </span>
  );
}
