import type { Metadata } from "next";
import { source } from "@/lib/source";
import { SITE_URL } from "@/lib/site-url";
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
import { PageActions } from "../../components/page-actions";
import { Attributes, Attribute } from "../../components/attributes";
import { PageFeedback } from "../../components/page-feedback";
import { MdxHeading } from "../../components/mdx-heading";
import { Advanced } from "../../components/advanced";
import type { ReactNode } from "react";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const jsonLd = buildJsonLd(page.url, page.data.title, page.data.description);

  const contentSlug = params.slug ?? [];
  const markdownPath = `/api/md${contentSlug.length ? `/${contentSlug.join("/")}` : ""}`;
  const askHref = `/ask?q=${encodeURIComponent(`Explain "${page.data.title}" from the VINR docs.`)}`;

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
      <PageActions markdownPath={markdownPath} askHref={askHref} tone="light" />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, Step, Steps, Tab, Tabs, Accordion, Accordions, TypeTable, File, Files, Folder, ImageZoom, Attributes, Attribute, Advanced, h2: ({ id, children }: { id?: string; children?: ReactNode }) => (<MdxHeading id={id} pageTitle={page.data.title} markdownPath={markdownPath}>{children}</MdxHeading>) }} />
        <PageFeedback url={page.url} />
      </DocsBody>
    </DocsPage>
    </>
  );
}

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
  // api-reference/* lives on its own /api-reference screen now and these URLs
  // redirect there (see next.config.mjs). Don't prerender them under /docs —
  // the content uses the <ApiExample> component that only the /api-reference
  // route provides.
  return source
    .generateParams("slug")
    .filter((p) => p.slug?.[0] !== "api-reference");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
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
