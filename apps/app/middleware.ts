import { PUBLIC_ROUTES } from '@repo/auth/public';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublicRoute = (request: NextRequest) => {
  return PUBLIC_ROUTES.some((route) => request.url.includes(route));
};

export const runtime = "nodejs"

export async function middleware(request: NextRequest) {
  
  try {
    const url = new URL('/api/auth/get-session', request.nextUrl.origin);
    await noseconeMiddleware(noseconeConfig)();

    const response = await fetch(url, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.statusText}`);
    }
    const session = await response.json();

    if (!isPublicRoute(request) && !session) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Same as before this runs on edge best to leave it
    console.error('Error in Middleware:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',

    '/((?!api|_next|ingest|.*\\..*).*)',
  ],
};