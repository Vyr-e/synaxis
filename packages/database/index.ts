import { env } from '@repo/env';
import { drizzle as drizzle_orm } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dbSchema from './schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const drizzle = drizzle_orm(pool, { schema: dbSchema });

// Export the schema separately to avoid naming conflicts
export const schema = dbSchema;
export { drizzle };
