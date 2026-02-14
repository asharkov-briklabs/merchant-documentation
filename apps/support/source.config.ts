import { defineCollections, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Merchant Support
export const merchant = defineCollections({
  type: 'doc',
  dir: 'content/merchant',
  schema: frontmatterSchema.extend({
    full: z.boolean().optional(),
  }),
});

// Bank Partner Support
export const banks = defineCollections({
  type: 'doc',
  dir: 'content/banks',
  schema: frontmatterSchema.extend({
    full: z.boolean().optional(),
  }),
});
