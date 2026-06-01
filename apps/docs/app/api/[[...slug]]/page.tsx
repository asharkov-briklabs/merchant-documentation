import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Root, API, APIInfo, APIExample, Responses, Response, ResponseTypes, ExampleResponse, TypeScriptResponse, Property, ObjectCollapsible, Requests, Request, APIPlayground } from "fumadocs-openapi/ui";
import { apiSource } from "@/lib/api-source";

const openApiComponents = {
  Root,
  API,
  APIInfo,
  APIExample,
  Responses,
  Response,
  ResponseTypes,
  ExampleResponse,
  TypeScriptResponse,
  Property,
  ObjectCollapsible,
  Requests,
  Request,
  APIPlayground,
};

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, ...openApiComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return apiSource.generateParams("slug");
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
