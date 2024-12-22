import { env } from '@repo/env';
import { logger } from '@repo/logger';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  logger.info('Running migrations...');

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    logger.success('Migrations completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  logger.error('Migration failed!', err);
  process.exit(1);
});
