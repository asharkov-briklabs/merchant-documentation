import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

const finalConfig = withMDX(config);

// Disable Turbopack in dev - incompatible with fumadocs-ui client components
if (finalConfig.experimental) {
  delete finalConfig.experimental.turbo;
}

export default finalConfig;
