import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from "fumadocs-ui/page";
import { createAPIPage } from "fumadocs-openapi/ui";
import { openapi } from "@/lib/openapi";
import { apiSource } from "@/lib/api-source";

const APIPage = createAPIPage(openapi);

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = apiSource.getPage(params.slug);
  if (!page) notFound();

  const apiProps = page.data.getAPIPageProps();

  return (
    <DocsPage toc={[]} full>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <APIPage {...apiProps} />
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
