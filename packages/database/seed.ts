import { neon } from '@neondatabase/serverless';
import { env } from '@repo/env';
import { logger } from '@repo/logger';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const pool = neon(env.DATABASE_URL);

const db = drizzle(pool, { schema });

async function seed() {
  logger('nodejs').info('Seeding database...');

  try {
    // Create test users
    const [user1] = await db
      .insert(schema.users)
      .values([
        {
          email: 'test@example.com',
          emailVerified: new Date().toISOString(),
          role: 'user',
          image: 'https://example.com/image.jpg',
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

    logger('nodejs').success('Seeding completed successfully');
  } catch (error) {
    logger('nodejs').error('Seeding failed:', error);
    throw error;
  } finally {
    logger('nodejs').info('Seeding completed successfully');
  }
}

seed().catch((err) => {
  logger('nodejs').error('Seeding failed!', err);
  process.exit(1);
});
