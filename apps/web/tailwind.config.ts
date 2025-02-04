// biome-ignore lint/nursery/noExportedImports: <explanation>
import { config } from '@repo/tailwind-config/config';
import tailwindScrollbar from 'tailwind-scrollbar';

config.plugins = [
  ...(config.plugins || []),
  tailwindScrollbar({ nocompatible: true }),
];

export default config;
