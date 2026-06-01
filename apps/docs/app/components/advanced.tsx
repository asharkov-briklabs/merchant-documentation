import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import type { ReactNode } from "react";

export function Advanced({
  title = "Advanced (Enterprise)",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Accordions type="single">
      <Accordion title={title}>{children}</Accordion>
    </Accordions>
  );
}
