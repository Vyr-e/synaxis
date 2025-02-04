import { locales } from '@/config/languages';
import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { secure } from '@repo/security';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import createIntlMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    // '/((?!_next|favicon.ico|icon.ico|icon.png|robots.txt|sitemap.xml|headshots|public|icon.ico|ingest/e|ingest/array|ingest/decide).*)',
    // '/((?!api|_next|.*\\.|icon|ingest).*)',
    // '/(de|en|es|jp|fr)/:path*',
    '/((?!api|_next|.*\\..*).*)',
  ],
};

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
  },
});

// Main middleware function
export default async function middleware(request: NextRequest) {
  try {
    // Security checks
    if (env.ARCJET_KEY) {
      await secure(
        ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:MONITOR'],
        request
      );
    }

    // Apply security headers
    const response = await intlMiddleware(request);

    // Apply nosecone security headers
    const securityResponse = await noseconeMiddleware(noseconeConfig)();

    // Merge the headers
    for (const [key, value] of securityResponse.headers.entries()) {
      response.headers.set(key, value);
    }

    return response;
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
