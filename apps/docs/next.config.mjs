import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
};

// The `dev` script runs plain `next dev` (no --turbo), so Turbopack is already
// off; no config surgery needed. If Turbopack is ever desired, validate it
// against fumadocs-ui's client components first.
export default withMDX(config);
