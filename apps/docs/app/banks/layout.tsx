import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { bankSource } from '@/lib/source';

export default function BankLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={bankSource.pageTree}
      nav={{
        title: 'Bank Partner Docs',
        url: '/banks',
      }}
      links={[
        {
          text: 'Merchant Docs',
          url: '/merchant',
        },
        {
          text: 'Partner API',
          url: '/banks/api',
        },
        {
          text: 'Support',
          url: 'https://support.vinr.com/banks',
          external: true,
        },
      ]}
    >
      <div className="border-b border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900 px-4 py-2 mb-4">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Partner Documentation</strong> - This section is for bank partners only
        </p>
      </div>
      {children}
    </DocsLayout>
  );
}
