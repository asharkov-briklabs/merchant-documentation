import { defineCollections } from 'fumadocs-mdx/config';

// Merchant Support
export const merchant = defineCollections({
  type: 'doc',
  dir: 'content/merchant',
});

// Bank Partner Support
export const banks = defineCollections({
  type: 'doc',
  dir: 'content/banks',
});
