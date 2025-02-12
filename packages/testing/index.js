const path = require('node:path');
const react = require('@vitejs/plugin-react');
const { defineConfig } = require('vitest/config');

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

module.exports = config;
