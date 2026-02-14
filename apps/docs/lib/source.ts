import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { merchant, banks } from '@/.source/server';

// Merchant Documentation
export const merchantSource = loader({
  baseUrl: '/merchant',
  source: toFumadocsSource(merchant, []),
});

// Bank Partner Documentation
export const bankSource = loader({
  baseUrl: '/banks',
  source: toFumadocsSource(banks, []),
});
