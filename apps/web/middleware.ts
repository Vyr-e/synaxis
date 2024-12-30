import { env } from '@repo/env';
import { parseError } from '@repo/observability/error';
import { secure } from '@repo/security';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const config = {
  matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

const securityHeaders = noseconeMiddleware(noseconeConfig);

export default async function middleware(request: Request) {
  if (!env.ARCJET_KEY) {
    return securityHeaders();
  }

  try {
    await secure(
      ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:MONITOR'],
      request
    );

    return securityHeaders();
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
