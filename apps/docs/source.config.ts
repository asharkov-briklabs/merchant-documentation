import { defineCollections } from 'fumadocs-mdx/config';

// Merchant Documentation
export const merchant = defineCollections({
  type: 'doc',
  dir: 'content/merchant',
});

// Bank Partner Documentation
export const banks = defineCollections({
  type: 'doc',
  dir: 'content/banks',
});
