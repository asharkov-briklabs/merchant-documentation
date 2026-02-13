import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';
import { icons } from 'lucide-react';
import { createElement } from 'react';

// Merchant Documentation
export const merchantSource = loader({
  baseUrl: '/merchant',
  source: createMDXSource({
    files: './content/merchant/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

// Merchant API Documentation
export const merchantApiSource = loader({
  baseUrl: '/api',
  source: createMDXSource({
    files: './content/api-merchant/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

// Bank Partner Documentation
export const bankSource = loader({
  baseUrl: '/banks',
  source: createMDXSource({
    files: './content/banks/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});

// Bank Partner API Documentation
export const bankApiSource = loader({
  baseUrl: '/banks/api',
  source: createMDXSource({
    files: './content/api-banks/**/*.mdx',
  }),
  icon(icon) {
    if (!icon) return;
    if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
  },
});
