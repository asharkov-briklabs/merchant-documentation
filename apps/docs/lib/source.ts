import { loader } from 'fumadocs-core/source';
import { merchant, banks } from '@/.source';

// Merchant Documentation
export const merchantSource = loader({
  baseUrl: '/merchant',
  source: merchant,
});

// Bank Partner Documentation
export const bankSource = loader({
  baseUrl: '/banks',
  source: banks,
});
