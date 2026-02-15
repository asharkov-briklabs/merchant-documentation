import { merchantSource } from '@/lib/source';
import type { Route } from './+types/merchant.$';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { getMDXComponents } from '@/mdx-components';

export async function loader({ params }: Route.LoaderArgs) {
  const slugPath = params['*'];
  const slug = slugPath ? slugPath.split('/') : [];
  const page = merchantSource.getPage(slug);

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    page: {
      title: page.data.title,
      description: page.data.description,
      toc: page.data.toc,
      full: page.data.full,
      body: page.data.body,
    },
  };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];

  return [
    { title: data.page.title },
    { name: 'description', content: data.page.description },
  ];
}

export default function MerchantPage({ loaderData }: Route.ComponentProps) {
  const { page } = loaderData;
  const MDX = page.body;

  return (
    <DocsLayout
      tree={merchantSource.pageTree}
      nav={{ title: 'Merchant Documentation' }}
    >
      <DocsPage toc={page.toc} full={page.full}>
        <DocsBody>
          <h1>{page.title}</h1>
          <MDX components={getMDXComponents()} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
