import { sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { userRole } from './enums';

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }),
    email: varchar('email', { length: 256 }).notNull().unique(),
    emailVerified: timestamp('emailVerified', { mode: 'string' }).notNull(),
    image: text('image'),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
    role: userRole('role').default('user').notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
);
