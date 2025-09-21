import { env } from '@repo/env';
import {
  config as baseConfig,
  withAnalyzer,
  withSentry,
} from '@repo/next-config';
import type { NextConfig } from 'next';

// Wrap config logic in an async function
const createNextConfig = async (): Promise<NextConfig> => {
  const config = await baseConfig(); // Await the config function

  let nextConfig: NextConfig = {
    ...config,
    // Enable typed routes (now stable in Next.js 15.5)
    typedRoutes: true,
    experimental: {
      // nodeMiddleware is now stable, no longer needed in experimental
      // Enable view transitions
      viewTransition: true,
      ...(config.experimental || {}),
    },
    serverExternalPackages: [
      // Remove React Email packages since they're not installed in this app
    ],
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
