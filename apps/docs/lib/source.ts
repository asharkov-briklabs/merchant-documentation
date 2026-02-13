import { createMDXSource } from 'fumadocs-mdx/runtime/next';
import { loader } from 'fumadocs-core/source';
import {
  merchantDocs,
  merchantMeta,
  apiMerchantDocs,
  apiMerchantMeta,
  banksDocs,
  banksMeta,
  apiBanksDocs,
  apiBanksMeta,
} from '@/.source';

// Merchant Documentation
export const merchantSource = loader({
  baseUrl: '/merchant',
  source: createMDXSource(merchantDocs, merchantMeta),
});

// Merchant API Documentation
export const merchantApiSource = loader({
  baseUrl: '/api',
  source: createMDXSource(apiMerchantDocs, apiMerchantMeta),
});

// Bank Partner Documentation
export const bankSource = loader({
  baseUrl: '/banks',
  source: createMDXSource(banksDocs, banksMeta),
});

// Bank Partner API Documentation
export const bankApiSource = loader({
  baseUrl: '/banks/api',
  source: createMDXSource(apiBanksDocs, apiBanksMeta),
});
