import { docs, meta } from "@/.source/server";
import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { icons } from "lucide-react";
import { createElement } from "react";

export const source = loader({
  baseUrl: "/docs",
  source: toFumadocsSource(docs, meta),
  // Resolve `icon` strings in meta.json (e.g. "CreditCard") to lucide icons,
  // used for product-root folders and the sidebar product switcher.
  icon(icon) {
    if (icon && icon in icons) {
      return createElement(icons[icon as keyof typeof icons]);
    }
  },
});
