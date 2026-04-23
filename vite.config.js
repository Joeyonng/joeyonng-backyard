import { execSync } from 'node:child_process';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE_PATH || '/joeyonng-backyard/';
const commitHash = process.env.VITE_COMMIT_SHA || execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  plugins: [react()],
  base,
  define: {
    __APP_COMMIT__: JSON.stringify(commitHash || 'unknown'),
  },
  esbuild: {
    loader: 'tsx',
    include: /.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
