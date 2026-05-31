import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { i18n } from "@/lib/i18n";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages = source.getPages(i18n.defaultLanguage).map((page) => ({
    url: `${SITE_URL}${page.url}`,
    lastModified: page.data.lastUpdated
      ? new Date(page.data.lastUpdated)
      : undefined,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticRoutes = ["", "/ask"].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.5,
  }));

  return [...staticRoutes, ...docPages];
}
