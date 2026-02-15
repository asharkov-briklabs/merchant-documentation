import 'fumadocs-core/source';
import type { TableOfContents } from 'fumadocs-core/server';

declare module 'fumadocs-core/source' {
  interface PageData {
    body: React.ComponentType;
    toc: TableOfContents;
    full?: boolean;
  }
}
