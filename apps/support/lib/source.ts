import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// Merchant Support
export const merchantSupportSource = loader({
  baseUrl: '/merchant',
  source: createMDXSource({
    files: './content/merchant/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

// Bank Partner Support
export const bankSupportSource = loader({
  baseUrl: '/banks',
  source: createMDXSource({
    files: './content/banks/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
