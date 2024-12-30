import { env } from '@repo/env';
import type { MetadataRoute } from 'next';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  // Define your routes manually
  const routes = [
    'home', // home
    'features',
    'pricing',
    'contact',
  ];

  return [
    {
      url: env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
      lastModified: new Date(),
    },
    ...routes.map((route) => ({
      url: new URL(route, env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL).href,
      lastModified: new Date(),
    })),
  ];
};

export default sitemap;
