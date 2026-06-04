import type { Metadata } from "next";
import { source } from "@/lib/source";
import { SITE_URL } from "@/lib/site-url";
import { DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { TypeTable } from "fumadocs-ui/components/type-table";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { ApiExample } from "../_components/api-example";
import { PageActions } from "../../components/page-actions";
import { Attributes, Attribute } from "../../components/attributes";
import { PageFeedback } from "../../components/page-feedback";
import { MdxHeading } from "../../components/mdx-heading";
import type { ReactNode } from "react";

/** Resolve an /api-reference/* slug to its content/docs/api-reference/* page. */
function getApiPage(slug: string[] | undefined) {
  return source.getPage(["api-reference", ...(slug ?? [])]);
}

export default async function ApiReferencePage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = getApiPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const contentSlug = ["api-reference", ...(params.slug ?? [])];
  const jsonLd = buildJsonLd(`/api-reference${params.slug ? `/${params.slug.join("/")}` : ""}`, page.data.title, page.data.description);
  const markdownPath = `/api/md/${contentSlug.join("/")}`;
  const askHref = `/ask?q=${encodeURIComponent(`Explain the "${page.data.title}" API from the VINR reference.`)}`;

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8 flex items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div className="min-w-0">
          <h1 className="text-[30px] font-bold tracking-[-0.02em] text-vinr-50">
            {page.data.title}
          </h1>
          {page.data.description && (
            <p className="mt-2 max-w-[640px] text-[15px] leading-[1.6] text-vinr-50/55">
              {page.data.description}
            </p>
          )}
        </div>
        <div className="shrink-0 pt-1">
          <PageActions markdownPath={markdownPath} askHref={askHref} tone="dark" />
        </div>
      </header>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Step,
            Steps,
            Tab,
            Tabs,
            Accordion,
            Accordions,
            TypeTable,
            File,
            Files,
            Folder,
            ImageZoom,
            ApiExample,
            Attributes,
            Attribute,
            h2: ({ id, children }: { id?: string; children?: ReactNode }) => (
              <MdxHeading
                id={id}
                pageTitle={page.data.title}
                markdownPath={markdownPath}
              >
                {children}
              </MdxHeading>
            ),
          }}
        />
        <PageFeedback url={`/api-reference${params.slug ? `/${params.slug.join("/")}` : ""}`} />
      </DocsBody>
    </>
  );
}

/** TechArticle + BreadcrumbList structured data for the current endpoint page. */
function buildJsonLd(path: string, title: string, description?: string) {
  const segments = path.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
    item: `${SITE_URL}/${segments.slice(0, i + 1).join("/")}`,
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "TechArticle", headline: title, description, url: `${SITE_URL}${path}` },
      { "@type": "BreadcrumbList", itemListElement: crumbs },
    ],
  };
}

export async function generateStaticParams() {
  return source
    .generateParams("slug")
    .filter((p) => p.slug?.[0] === "api-reference")
    .map((p) => ({ slug: (p.slug ?? []).slice(1) }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = getApiPage(params.slug);
  if (!page) notFound();

  const canonical = `/api-reference${params.slug ? `/${params.slug.join("/")}` : ""}`;
  const { title, description } = page.data;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "article", title, description, url: canonical },
    twitter: { card: "summary_large_image", title, description },
  };
}
