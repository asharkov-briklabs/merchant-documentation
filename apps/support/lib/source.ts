import { loader } from 'fumadocs-core/source';
import { merchant, banks } from 'fumadocs-mdx:collections/server';

// Merchant Support
export const merchantSupportSource = loader({
  baseUrl: '/merchant',
  source: merchant.toFumadocsSource(),
});

// Bank Partner Support
export const bankSupportSource = loader({
  baseUrl: '/banks',
  source: banks.toFumadocsSource(),
});
