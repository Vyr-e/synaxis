import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { mediaType } from './enums';
import { events } from './events';
import { users } from './users';

export const eventMedia = pgTable('event_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  type: mediaType('type').notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  title: varchar('title', { length: 256 }),
  description: varchar('description', { length: 500 }),

  isApproved: boolean('is_approved').default(false), // For user-submitted media
  order: integer('order').default(0),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export default eventMedia;
