import withBundleAnalyzer from '@next/bundle-analyzer';

// @ts-expect-error No declaration file
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin';
import { env } from '@repo/env';
import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const otelRegex = /@opentelemetry\/instrumentation/;

const baseConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },

  // biome-ignore lint/suspicious/useAwait: rewrites is async
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*',
      },
      {
        source: '/ingest/decide',
        destination: 'https://us.i.posthog.com/decide',
      },
    ];
  },

  webpack(config, { isServer }) {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    config.ignoreWarnings = [{ module: otelRegex }];

    return config;
  },

  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export const createConfig = async (config: NextConfig): Promise<NextConfig> => {
  let finalConfig = { ...config };

  // Dynamically import Vercel toolbar
  const withVercelToolbar = (await import('@vercel/toolbar/plugins/next'))
    .default;

  // Add Vercel toolbar if secret is present
  if (env.FLAGS_SECRET) {
    finalConfig = withVercelToolbar()(finalConfig as any);
  }

  // Add Sentry if needed
  if (env.SENTRY_ORG && env.SENTRY_PROJECT) {
    finalConfig = withSentry(finalConfig as any);
  }

  // Add analyzer if needed
  if (env.ANALYZE === 'true') {
    finalConfig = withAnalyzer(finalConfig);
  }

  return finalConfig;
};

export const config = async () => await createConfig(baseConfig);

export const sentryConfig: Parameters<typeof withSentryConfig>[1] = {
  org: env.SENTRY_ORG,
  project: env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  /*
   * For all available options, see:
   * https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
   */

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  /*
   * Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
   * This can increase your server load as well as your hosting bill.
   * Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
   * side errors will fail.
   */
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  /*
   * Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
   * See the following for more information:
   * https://docs.sentry.io/product/crons/
   * https://vercel.com/docs/cron-jobs
   */
  automaticVercelMonitors: true,
};

export const withSentry = (sourceConfig: NextConfig): NextConfig =>
  withSentryConfig(sourceConfig, sentryConfig);

export const withAnalyzer = (sourceConfig: NextConfig): NextConfig => {
  const withBundleAnalyzerConfig = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  });
  return withBundleAnalyzerConfig(sourceConfig as NextConfig);
};

export { withLogtail } from '@logtail/next';
