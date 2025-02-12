import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock env variables
vi.mock('@repo/env', () => ({
  env: {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    GOOGLE_ID: 'mock-google-id',
    GOOGLE_SECRET: 'mock-google-secret',
    FACEBOOK_ID: 'mock-facebook-id',
    FACEBOOK_SECRET: 'mock-facebook-secret',
    X_ID: 'mock-twitter-id',
    X_SECRET: 'mock-twitter-secret',
    RESEND_FROM: 'test@example.com',
    RESEND_TOKEN: 'mock-resend-token',
    DATABASE_URL: 'mock-db-url',
    BETTER_AUTH_SECRET: 'mock-auth-secret',
    // Additional env vars
    ARCJET_KEY: 'mock-arcjet-key',
    BASEHUB_TOKEN: 'mock-basehub-token',
    BETTERSTACK_API_KEY: 'mock-betterstack-key',
    BETTERSTACK_URL: 'mock-betterstack-url',
    FLAGS_SECRET: 'mock-flags-secret',
    STRIPE_SECRET_KEY: 'mock-stripe-secret',
    SENTRY_AUTH_TOKEN: 'mock-sentry-token',
    SENTRY_ORG: 'mock-sentry-org',
    SENTRY_PROJECT: 'mock-sentry-project',
    STRIPE_WEBHOOK_SECRET: 'mock-stripe-webhook',
    SVIX_TOKEN: 'mock-svix-token',
    REDIS_URL: 'mock-redis-url',
    UPSTASH_REDIS_REST_URL: 'mock-upstash-url',
    UPSTASH_REDIS_REST_TOKEN: 'mock-upstash-token',
    AUTH_SECRET: 'mock-auth-secret',
  },
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock auth client
vi.mock('@repo/auth/client', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated',
  }),
  authClient: {
    signIn: {
      social: vi.fn(),
      email: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
    },
  },
}));
