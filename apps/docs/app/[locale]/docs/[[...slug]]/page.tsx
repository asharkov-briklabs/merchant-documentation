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

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      lastUpdate={
        page.data.lastUpdated ? new Date(page.data.lastUpdated) : undefined
      }
      editOnGithub={{
        owner: "vinr",
        repo: "documentation",
        sha: "main",
        path: `content/docs/${page.file.path}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, Step, Steps, Tab, Tabs, Accordion, Accordions, TypeTable, File, Files, Folder, ImageZoom }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams("slug", "locale");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
