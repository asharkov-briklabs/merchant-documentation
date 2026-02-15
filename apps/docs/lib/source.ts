import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/browser';
import { merchant, banks } from 'fumadocs-mdx:collections/browser';

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
