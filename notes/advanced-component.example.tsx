// EXAMPLE — optional thin wrapper for a consistent "Advanced" disclosure label.
// Reference only; not wired up. To adopt:
//   1. Put this in apps/docs/components/advanced.tsx
//   2. Import it in app/[locale]/docs/[[...slug]]/page.tsx and add `Advanced`
//      to the MDX `components={{ ... }}` map.
//   3. In MDX:  <Advanced>…enterprise content…</Advanced>
//
// It just wraps the already-registered fumadocs Accordion so every page gets the
// same label and affordance — that consistency is the whole point of the pattern.
// Until the pattern proves out, using <Accordions>/<Accordion> directly is fine.

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

export function Advanced({
  title = "Advanced (Enterprise)",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Accordions>
      <Accordion title={title}>{children}</Accordion>
    </Accordions>
  );
}
