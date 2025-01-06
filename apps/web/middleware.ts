import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { secure } from '@repo/security';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales } from './config/languages';
import {routing} from "./i18n/routing"

export const runtime = 'nodejs';

export const config = {
  matcher: [
    // Match all paths except those starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files (public folder)
    // - images (your image folder)
    // - api routes
    '/((?!api|_next/static|_next/image|favicon.ico|images|headshots|features|public).*)',
    
    // i18n routes
    "/(es|fr|de|jp|en)/:path*",
    
    // Match root path
    "/"
  ]
};

// Create the next-intl middleware
const intlMiddleware = createIntlMiddleware(routing);

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
    Object.entries(securityResponse.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
