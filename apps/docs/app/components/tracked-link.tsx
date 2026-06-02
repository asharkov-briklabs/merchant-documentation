"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentPropsWithoutRef<typeof Link> & {
  eventLabel: string;
  eventLocation: string;
};

export function TrackedLink({ eventLabel, eventLocation, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent("cta_click", { label: eventLabel, location: eventLocation });
        onClick?.(e);
      }}
    />
  );
}
