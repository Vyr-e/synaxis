import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './setup.ts')],
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './'),
      '@repo': path.resolve(process.cwd(), '../../packages'),
      '@/app': path.resolve(process.cwd(), './app'),
      '@/components': path.resolve(process.cwd(), './components'),
    },
  },
});

export default config;
