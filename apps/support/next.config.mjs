import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX({
  configPath: './source.config.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  typescript: {
    // Temporarily ignore type errors during build
    ignoreBuildErrors: true,
  },
};

export default withMDX(nextConfig);
