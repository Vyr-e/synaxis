import { env } from '@repo/env';
import { init } from '@sentry/nextjs';

const SENTRY_DSN = env.NEXT_PUBLIC_SENTRY_DSN;

export function initializeSentry() {
  if (!SENTRY_DSN) {
    // biome-ignore lint/suspicious/noConsole: Pino logger doesnt work in edge, better alt is console
    console.warn('Sentry DSN not found');
    return;
  }

  init({
    dsn: SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 1.0,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [],
  });
}
