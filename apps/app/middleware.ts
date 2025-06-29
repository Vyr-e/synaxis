import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { PUBLIC_ROUTES } from '@repo/auth/public';
import { auth } from '@repo/auth/server';

const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};

type Session = typeof auth.$Infer.Session;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect root path to signup


  try {
    await noseconeMiddleware(noseconeConfig)();
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Important for logging middleware errors
    console.error('Nosecone Middleware Error:', error as Error);
    // return NextResponse.redirect(new URL('/error', request.url));
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (isPublicRoute(pathname)) {
    if (
      pathname === '/onboard' &&
      session &&
      (session.user as unknown as { userProfileStep: string })
        ?.userProfileStep === 'completed'
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (pathname === '/onboard') {
    if (!session.user?.emailVerified) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url));
    }
    if ((session.user as unknown as { userProfileStep: string })?.userProfileStep === 'completed') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Configuration for the middleware
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/((?!api|_next|ingest|.*\\..*).*)',
    '/onboard',
  ],
  runtime: 'nodejs',
};
