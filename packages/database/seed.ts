import { env } from '@repo/env';
import { logger } from '@repo/logger';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
  logger.info('Seeding database...');

  try {
    // Create test users
    const [user1] = await db
      .insert(schema.users)
      .values([
        {
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
        // Add more seed data
      ])
      .returning();

    // Create test events
    await db.insert(schema.events).values([
      {
        title: 'Test Event',
        description: 'A test event',
        slug: 'test-event',
        startDate: new Date(),
        endDate: new Date(),
        organizerId: user1.id,
      },
    ]);

    logger.success('Seeding completed successfully');
  } catch (error) {
    logger.error('Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch((err) => {
  logger.error('Seeding failed!', err);
  process.exit(1);
});
