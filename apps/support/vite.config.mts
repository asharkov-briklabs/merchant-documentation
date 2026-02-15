import { reactRouter } from '@react-router/dev/vite';
import mdx from 'fumadocs-mdx/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';
import * as collections from './source.config';

export default defineConfig({
  plugins: [
    mdx(collections),
    tsconfigPaths(),
    reactRouter(),
  ],
});
