import { bankSupportSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layout';
import type { ReactNode } from 'react';

export default function BanksLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={bankSupportSource.pageTree} nav={{ title: 'Bank Partner Support' }}>
      {children}
    </DocsLayout>
  );
}
