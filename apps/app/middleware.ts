import { PUBLIC_ROUTES } from '@repo/auth/public';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublicRoute = (request: NextRequest) => {
  return PUBLIC_ROUTES.some((route) => request.url.includes(route));
};

export async function middleware(request: NextRequest) {
  try {
    await noseconeMiddleware(noseconeConfig)();

    const sessionResponse = await fetch(
      new URL('/api/auth/get-session', request.url),
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      }
    );

    const session = await sessionResponse.json();

    if (!isPublicRoute(request) && !session) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in Middleware:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|_next|ingest|.*\\..*).*)',
  ],
};
