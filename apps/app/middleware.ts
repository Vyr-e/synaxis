import { PUBLIC_ROUTES } from '@repo/auth/public';
import { auth } from '@repo/auth/server';
import { env } from '@repo/env';
import { noseconeConfig, noseconeMiddleware } from '@repo/security/middleware';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const isPublicRoute = (pathname: string) => {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;



  // Skip auth for UploadThing API routes - they handle their own auth
  if (pathname.startsWith('/api/uploadthing')) {
    return NextResponse.next();
  }

  try {
    await noseconeMiddleware(noseconeConfig)();
  } catch (error) {
    console.error('Nosecone Middleware Error:', error as Error);
    // return NextResponse.redirect(new URL('/error', request.url));
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // if(!session && pathname)

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

  // Check if route is public
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Redirect to sign-up for root path when no session
  if (!session && pathname === '/') {
    return NextResponse.redirect(new URL('/auth/sign-up', request.url));
  }

  // Redirect to sign-in for all other protected routes when no session
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
    '/((?!api/auth|api/uploadthing|_next/static|_next/image|favicon.ico).*)',
    '/onboard',
    "/legal"
  ],
  runtime: 'nodejs',
};
