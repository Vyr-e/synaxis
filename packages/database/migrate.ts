import 'dotenv/config';
import { resolve } from 'node:path';
import { env } from '@repo/env';
import { drizzle as drizzle_orm } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle_orm(pool);

(async () => {
  await migrate(db, { migrationsFolder: resolve(__dirname, './drizzle') });
})();
