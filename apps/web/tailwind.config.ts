// biome-ignore lint/nursery/noExportedImports: <explanation>
import { config } from '@repo/tailwind-config/config';
import tailwindScrollbar from 'tailwind-scrollbar';

config.content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx}',
  '../../packages/design-system/**/*.{js,ts,jsx,tsx}', // Include shared components
];

// Safelist any classes that are dynamically created
config.safelist = [
  'bg-purple-100',
  'text-purple-700',
  // Add other dynamic classes here
];

config.plugins = [
  ...(config.plugins || []),
  tailwindScrollbar({ nocompatible: true }),
];

export default config;
