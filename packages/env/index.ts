import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const server = {
  // Database
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  TOOLBAR: z.string(),

  // Auth
  AUTH_SECRET: z.string().min(1),
  GOOGLE_ID: z.string().min(1),
  GOOGLE_SECRET: z.string().min(1),
  FACEBOOK_ID: z.string().min(1),
  FACEBOOK_SECRET: z.string().min(1),
  X_ID: z.string().min(1),
  X_SECRET: z.string().min(1),

  // Email
  RESEND_FROM: z.string().min(1).email(),
  RESEND_TOKEN: z.string().min(1).startsWith('re_'),

  // Payments
  STRIPE_SECRET_KEY: z.string().min(1).startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith('whsec_'),
  BETTERSTACK_API_KEY: z.string().min(1),
  BETTERSTACK_URL: z.string().min(1).url(),
  ARCJET_KEY: z.string().min(1).startsWith('ajkey_'),
  ANALYZE: z.string(),
  // Added by Sentry Integration, Vercel Marketplace
  SENTRY_ORG: z.string().min(1),
  SENTRY_PROJECT: z.string().min(1),

  // Added by Vercel
  VERCEL: z.string(),
  NEXT_RUNTIME: z.enum(['nodejs', 'edge']),
  FLAGS_SECRET: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),

  // AI & Integrations
  GITHUB_AI_KEY: z.string().min(1),
  AZURE_AI_ENDPOINT: z.string().min(1).url(),
  AI_MODEL_NAME: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1).startsWith('sk-'),
  LIVEBLOCKS_SECRET: z.string().min(1).startsWith('sk_'),
  SVIX_TOKEN: z.union([
    z.string().min(1).startsWith('sk_'),
    z.string().min(1).startsWith('testsk_'),
  ]),
  NODE_ENV: z.enum(['development', 'production', 'test']),
};

const client = {
  // URLs
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_WEB_URL: z.string().min(1).url(),
  NEXT_PUBLIC_API_URL: z.string().min(1).url(),
  NEXT_PUBLIC_DOCS_URL: z.string().min(1).url(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).startsWith('G-'),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith('phc_'),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),

  // Added by Vercel
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1),
};

export const env = createEnv({
  server,
  client,

  runtimeEnv: {
    TOOLBAR: process.env.TOOLBAR,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    AUTH_SECRET: process.env.AUTH_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    FACEBOOK_ID: process.env.FACEBOOK_ID,
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
    X_ID: process.env.X_ID,
    X_SECRET: process.env.X_SECRET,
    RESEND_FROM: process.env.RESEND_FROM,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_TOKEN: process.env.RESEND_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ARCJET_KEY: process.env.ARCJET_KEY,
    ANALYZE: process.env.ANALYZE,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    VERCEL: process.env.VERCEL,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    FLAGS_SECRET: process.env.FLAGS_SECRET,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    REDIS_URL: process.env.REDIS_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    BETTERSTACK_API_KEY: process.env.BETTERSTACK_API_KEY,
    BETTERSTACK_URL: process.env.BETTERSTACK_URL,
    GITHUB_AI_KEY: process.env.GITHUB_AI_KEY,
    AZURE_AI_ENDPOINT: process.env.AZURE_AI_ENDPOINT,
    AI_MODEL_NAME: process.env.AI_MODEL_NAME,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    LIVEBLOCKS_SECRET: process.env.LIVEBLOCKS_SECRET,
    SVIX_TOKEN: process.env.SVIX_TOKEN,
  },
});
