import { sql } from 'drizzle-orm';
import {
  boolean,
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
    email: varchar('email', { length: 256 }).notNull(),
    password: varchar('password', { length: 256 }),
    emailVerified: timestamp('emailVerified', { mode: 'string' }),
    image: text('image'),
    twoFactorSecret: text('twoFactorSecret'),
    twoFactorEnabled: boolean('twoFactorEnabled').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    role: userRole('role').default('user').notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
  })
);
