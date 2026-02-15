import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/browser';
import { merchant, banks } from 'fumadocs-mdx:collections/browser';

// Merchant Support
export const merchantSupportSource = loader({
  baseUrl: '/merchant',
  source: toFumadocsSource(merchant, []),
});

// Bank Partner Support
export const bankSupportSource = loader({
  baseUrl: '/banks',
  source: toFumadocsSource(banks, []),
});
