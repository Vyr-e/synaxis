import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import type {} from './enums';
import { collaborationRole, collaborationType } from './enums';
import { events } from './events';
import { users } from './users';

export const collaborations = pgTable('collaborations', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  type: collaborationType('type').notNull().default('organizer'),
  role: collaborationRole('role').notNull().default('owner'),

  // For sponsors/vendors
  companyName: varchar('company_name', { length: 256 }),
  logo: varchar('logo', { length: 500 }),
  website: varchar('website', { length: 500 }),

  description: text('description'),
  isPublic: boolean('is_public').default(true),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export const eventFaqs = pgTable('event_faqs', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  question: varchar('question', { length: 500 }).notNull(),
  answer: text('answer').notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export default collaborations;
