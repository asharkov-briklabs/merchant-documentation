import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';
import { merchantSource } from '@/lib/source';

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={merchantSource.pageTree}
      nav={{
        title: 'Vinr Docs',
        url: '/merchant',
      }}
      links={[
        {
          text: 'API Reference',
          url: '/api',
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
