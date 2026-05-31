import type { Metadata } from "next";
import { source } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";

export default async function Page(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  const MDX = page.data.body;
  const jsonLd = buildJsonLd(page.url, page.data.title, page.data.description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lastUpdate={
        page.data.lastUpdated ? new Date(page.data.lastUpdated) : undefined
      }
      editOnGithub={{
        owner: "asharkov-briklabs",
        repo: "Vinr-Merchant_Documentation",
        sha: "main",
        path: `apps/docs/content/docs/${page.file.path}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, Step, Steps, Tab, Tabs, Accordion, Accordions, TypeTable, File, Files, Folder, ImageZoom }} />
      </DocsBody>
    </DocsPage>
    </>
  );
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

/** TechArticle + BreadcrumbList structured data for the current doc page. */
function buildJsonLd(url: string, title: string, description?: string) {
  const segments = url.split("/").filter(Boolean); // ["docs", "payments", ...]
  const crumbs = segments.map((seg, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: seg
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase()),
    item: `${SITE_URL}/${segments.slice(0, i + 1).join("/")}`,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description,
        url: `${SITE_URL}${url}`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs,
      },
    ],
  };
}

export async function generateStaticParams() {
  return source.generateParams("slug", "locale");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  const { title, description } = page.data;
  return {
    title,
    description,
    alternates: { canonical: page.url },
    openGraph: {
      type: "article",
      title,
      description,
      url: page.url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
