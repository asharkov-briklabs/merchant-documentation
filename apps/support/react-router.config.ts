import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';

const getMerchantUrl = createGetUrl('/merchant');
const getBanksUrl = createGetUrl('/banks');

export default {
  ssr: false, // Static site generation (SPA mode)
  async prerender({ getStaticPaths }) {
    const paths: string[] = [...getStaticPaths()];

    // Prerender merchant docs
    for await (const entry of glob('**/*.mdx', { cwd: 'content/merchant' })) {
      paths.push(getMerchantUrl(getSlugs(entry)));
    }

    // Prerender banks docs
    for await (const entry of glob('**/*.mdx', { cwd: 'content/banks' })) {
      paths.push(getBanksUrl(getSlugs(entry)));
    }

    return paths;
  },
} satisfies Config;
