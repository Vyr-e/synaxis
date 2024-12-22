import { env } from '@repo/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
