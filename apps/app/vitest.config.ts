import baseConfig from '@repo/testing';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
    },
  })
);
