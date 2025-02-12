import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const server = {
  // Required core vars
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  AUTH_SECRET: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Auth providers - optional
  GOOGLE_ID: z.string().min(1),
  GOOGLE_SECRET: z.string().min(1),
  FACEBOOK_ID: z.string().min(1),
  FACEBOOK_SECRET: z.string().min(1),
  X_ID: z.string().min(1),
  X_SECRET: z.string().min(1),

  // Optional infrastructure
  REDIS_URL: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
  TOOLBAR: z.string().optional(),

  // Optional integrations
  RESEND_FROM: z.string().email(),
  RESEND_TOKEN: z.string().startsWith('re_'),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  BETTERSTACK_API_KEY: z.string().optional(),
  BETTERSTACK_URL: z.string().url().optional(),
  ARCJET_KEY: z.string().startsWith('ajkey_').optional(),
  ANALYZE: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  VERCEL: z.string().optional(),
  NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
  FLAGS_SECRET: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
  GITHUB_AI_KEY: z.string().optional(),
  AZURE_AI_ENDPOINT: z.string().url().optional(),
  AI_MODEL_NAME: z.string().optional(),
  OPENAI_API_KEY: z.string().startsWith('sk-').optional(),
  SVIX_TOKEN: z
    .union([z.string().startsWith('sk_'), z.string().startsWith('testsk_')])
    .optional(),
};

const client = {
  // Required public URLs
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Optional public vars
  NEXT_PUBLIC_WEB_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_DOCS_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().startsWith('G-').optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().startsWith('phc_'),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
  NEXT_PUBLIC_SENTRY_DSN: z.string(),
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().optional(),
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
    SVIX_TOKEN: process.env.SVIX_TOKEN,
  },
});
