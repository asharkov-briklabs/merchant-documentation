import { loader } from 'fumadocs-core/source';
import { merchant, banks } from 'fumadocs-mdx:collections/server';

// Merchant Documentation
export const merchantSource = loader({
  baseUrl: '/merchant',
  source: merchant.toFumadocsSource(),
});

// Bank Partner Documentation
export const bankSource = loader({
  baseUrl: '/banks',
  source: banks.toFumadocsSource(),
});
