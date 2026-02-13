import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const {
  docs: merchantDocs,
  meta: merchantMeta,
} = defineDocs({
  dir: 'content/merchant',
});

export const {
  docs: apiMerchantDocs,
  meta: apiMerchantMeta,
} = defineDocs({
  dir: 'content/api-merchant',
});

export const {
  docs: banksDocs,
  meta: banksMeta,
} = defineDocs({
  dir: 'content/banks',
});

export const {
  docs: apiBanksDocs,
  meta: apiBanksMeta,
} = defineDocs({
  dir: 'content/api-banks',
});

export default defineConfig();
