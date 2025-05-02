import { env } from '@repo/env';
import { config as baseConfig, withAnalyzer, withSentry } from '@repo/next-config';
import type { NextConfig } from 'next';

// Wrap config logic in an async function
const createNextConfig = async (): Promise<NextConfig> => {
  const config = await baseConfig(); // Await the config function

  let nextConfig: NextConfig = {
    ...config,
    experimental: {
      nodeMiddleware: true,
      ...(config.experimental || {}),
    },
  };

  if (env.VERCEL) {
    nextConfig = withSentry(nextConfig);
  }

  if (env.ANALYZE === 'true') {
    nextConfig = withAnalyzer(nextConfig);
  }

  return nextConfig;
};

export default createNextConfig; // Export the async function
