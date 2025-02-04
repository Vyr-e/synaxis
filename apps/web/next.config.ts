import { env } from '@repo/env';
import { config, withAnalyzer } from '@repo/next-config';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

let nextConfig: NextConfig = async () => await config();

// Add other configurations
nextConfig.experimental = {
  ...nextConfig.experimental,
  turbo: {
    '@repo/ui-utils': '@repo/ui-utils/src',
    '@repo/design-system': '@repo/design-system/src',
  },
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
  moduleIdStrategy: 'named',
} as NextConfig['experimental'];

// Add other configurations
nextConfig.images?.remotePatterns?.push(
  {
    protocol: 'https',
    hostname: 'assets.basehub.com',
  },
  {
    protocol: 'https',
    hostname: 'utfs.io',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'vsfl8k9xl7.ufs.sh',
    pathname: '/**',
  }
);

// Add production redirects
if (env.NODE_ENV === 'production') {
  const redirects: NextConfig['redirects'] = async () => [
    {
      source: '/legal',
      destination: '/legal/privacy',
      statusCode: 301,
    },
  ];

  nextConfig.redirects = redirects;
}

// Add analyzer if needed
if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default withNextIntl(nextConfig);
