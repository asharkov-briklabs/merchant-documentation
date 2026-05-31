import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { SITE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const docPages = source.getPages().map((page) => ({
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
