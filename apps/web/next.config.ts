import { withCMS } from '@repo/cms/next-config';
import { env } from '@repo/env';
import { config, withAnalyzer } from '@repo/next-config';
import type { NextConfig } from 'next';

let nextConfig: NextConfig = { ...config };

// Add Turbopack configuration
nextConfig.experimental = {
  ...nextConfig.experimental,
  turbo: {
    resolveAlias: {
      // Add aliases for local packages
      '@repo/ui-utils': '@repo/ui-utils/src',
      '@repo/design-system': '@repo/design-system/src',
    },
    // Add custom extensions to resolve
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
    // Use named module IDs for development
    moduleIdStrategy: 'named',
  },
};

nextConfig.images?.remotePatterns?.push({
  protocol: 'https',
  hostname: 'assets.basehub.com',
});

if (process.env.NODE_ENV === 'production') {
  const redirects: NextConfig['redirects'] = async () => [
    {
      source: '/legal',
      destination: '/legal/privacy',
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default withCMS(nextConfig);
