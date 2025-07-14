import ip from '@arcjet/ip';
import arcjet, {
  type ArcjetDecision,
  type ArcjetEmailType,
  type ArcjetMode,
  protectSignup,
  shield,
} from '@arcjet/next';
import { PUBLIC_ROUTES } from '@repo/auth/public';
import { auth } from '@repo/auth/server';
import { env } from '@repo/env';
import { toNextJsHandler } from 'better-auth/next-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ARCJET_MODE: ArcjetMode =
  env.NODE_ENV === 'production' ? 'LIVE' : 'DRY_RUN';

const isPublicRoute = (request: NextRequest) => {
  return PUBLIC_ROUTES.some((route) => request.url.includes(route));
};

const debug = <T>(...args: T[]) => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // biome-ignore lint/suspicious/noConsole: Redundant lint
  // biome-ignore lint/suspicious/noConsoleLog:  Redundant lint
  console.log('[Auth Route]', ...args);
};

// Configure Arcjet protection
const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ['userId'],
  rules: [
    shield({ mode: ARCJET_MODE }),
    protectSignup({
      email: {
        mode: ARCJET_MODE,
        block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
      },
      bots: {
        mode: ARCJET_MODE,
        allow: [],
      },
      rateLimit: {
        mode: ARCJET_MODE,
        interval: '5m',
        max: 5,
      },
    }),
  ],
});

const EMAIL_ERRORS = {
  FREE: 'We do not allow free email addresses.',
  INVALID: 'Email address format is invalid. Is there a typo?',
  DISPOSABLE: 'We do not allow disposable email addresses.',
  NO_MX_RECORDS:
    'Your email domain does not have an MX record. Is there a typo?',
  NO_GRAVATAR: 'We do not accept gravatar email addresses.',
} satisfies Record<ArcjetEmailType, string>;

async function protect(req: NextRequest): Promise<ArcjetDecision> {
  const session = await auth.api.getSession({ headers: req.headers });
  const sessionId = session?.user?.id;
  const requestIp = ip(req);
  const body = await req.clone().json();

  const { pathname } = req.nextUrl;
  const userId =
    sessionId ??
    (typeof requestIp === 'string' && requestIp !== ''
      ? requestIp
      : 'unknown_user_or_ip');

  let emailForValidation: string | undefined;
  if (
    pathname.includes('/sign-up') ||
    pathname.includes('/resend-verification')
  ) {
    emailForValidation = body.email;
  } else if (pathname.includes('/change-email')) {
    emailForValidation = body.newEmail; // Use newEmail for this route
  }

  if (emailForValidation) {
    return aj.protect(req, { userId, email: emailForValidation });
  }
  return aj.protect(req, { userId, email: '' });
}

// Initialize auth handlers
const authHandlers = toNextJsHandler(auth.handler);

// Protected POST handler
export const POST = async (req: NextRequest) => {
  try {
    const decision = await protect(req);
    debug('POST request received', req.url);

    if (decision.isDenied()) {
      if (decision.reason.isShield()) {
        return NextResponse.json(
          { message: 'You are not authorized to access this resource.' },
          { status: 403 }
        );
      }

      if (decision.reason.isBot()) {
        return NextResponse.json(
          { message: 'You are not authorized to access this resource.' },
          { status: 403 }
        );
      }

      if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          {
            message:
              'Too many requests, you have been rate limited. Please retry in 5 minutes.',
          },
          { status: 429 }
        );
      }

      if (decision.reason.isEmail()) {
        const message = decision.reason.emailTypes.map(
          (type) => EMAIL_ERRORS[type] ?? 'Invalid email.'
        )[0];
        return NextResponse.json({ message }, { status: 400 });
      }

      return NextResponse.json(
        'You are not authorized to access this resource.',
        { status: 403 }
      );
    }
    return authHandlers.POST(req);
  } catch (error) {
    debug('Error in POST', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
};

export const { GET } = authHandlers;
