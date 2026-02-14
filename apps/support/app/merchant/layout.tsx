import { merchantSupportSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';

export default function MerchantLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={merchantSupportSource.pageTree} nav={{ title: 'Merchant Support' }}>
      {children}
    </DocsLayout>
  );
}
