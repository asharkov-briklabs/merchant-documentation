import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';
import { bankApiSource } from '@/lib/source';

export default function BankApiLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={bankApiSource.pageTree}
      nav={{
        title: 'Bank Partner API',
        url: '/banks/api',
      }}
      links={[
        {
          text: 'Partner Docs',
          url: '/banks',
        },
        {
          text: 'Merchant Docs',
          url: '/merchant',
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
          <strong>Partner API</strong> - These endpoints are only available to bank partners
        </p>
      </div>
      {children}
    </DocsLayout>
  );
}
