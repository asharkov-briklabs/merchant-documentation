import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';
import { merchantApiSource } from '@/lib/source';

export default function ApiLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={merchantApiSource.pageTree}
      nav={{
        title: 'Vinr API',
        url: '/api',
      }}
      links={[
        {
          text: 'Documentation',
          url: '/merchant',
        },
        {
          text: 'Bank Partners',
          url: '/banks',
        },
        {
          text: 'Support',
          url: 'https://support.vinr.com',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
