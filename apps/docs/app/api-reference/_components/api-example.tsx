"use client";

import { useEffect, useRef } from "react";
import { useApiRef, type ApiSample } from "./api-ref-context";

/**
 * Authored inline in API-reference MDX. It renders no visible content itself —
 * it drops an invisible scroll marker where the endpoint sits in the prose and
 * registers its request/response with the shared context, so the sticky right
 * rail can show the matching code (and switch it with the language selector).
 *
 * ```mdx
 * <ApiExample
 *   id="create-payment"
 *   title="Create a payment"
 *   method="POST"
 *   path="/v1/payments"
 *   request={{ curl: `curl ...`, node: `await vinr.payments.create(...)` }}
 *   response={`{ "id": "pay_..." }`}
 * />
 * ```
 */
export function ApiExample(props: ApiSample) {
  const { register, unregister, setActiveId } = useApiRef();
  const ref = useRef<HTMLDivElement>(null);
  const { id } = props;

  // Register the sample (static for a given id in MDX, so id is the only dep).
  useEffect(() => {
    register(props);
    return () => unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Scroll-spy: mark this example active as its section crosses the upper band.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [id, setActiveId]);

  return <div ref={ref} data-api-example={id} aria-hidden className="scroll-mt-24" />;
}
