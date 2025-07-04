import { PUBLIC_ROUTES } from '@repo/auth/public';
import { auth } from '@repo/auth/server';
import { env } from '@repo/env';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublicRoute = (pathname: string) => {
  if (pathname === '/') return true;
  return PUBLIC_ROUTES.some(
    (route) => route !== '/' && pathname.startsWith(route)
  );
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  try {
    await noseconeMiddleware(noseconeConfig)();
  } catch (error) {
    console.error('Nosecone Middleware Error:', error as Error);
    // return NextResponse.redirect(new URL('/error', request.url));
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userOnboardingStep = (
    session?.user as unknown as { userProfileStep: string }
  )?.userProfileStep;

  if (pathname.startsWith('/onboard')) {
    if (session) {
      if (userOnboardingStep === 'completed') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (!session.user?.emailVerified) {
        return NextResponse.redirect(
          new URL('/auth/verify-email', request.url)
        );
      }
    }
    return NextResponse.next();
  }

  if (env.NODE_ENV === 'production' && !session && pathname !== '/') {
    //TODO: Remove this once we have a dashboard for non-logged in users
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
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
