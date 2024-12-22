import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { referralStatus } from './enums';
import { events } from './events';
import { users } from './users';

export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerId: uuid('referrer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  referredId: uuid('referred_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  code: varchar('code', { length: 50 }).notNull().unique(),
  status: referralStatus('status').notNull(),

  // Rewards
  rewardAmount: decimal('reward_amount', { precision: 10, scale: 2 }),
  isPaid: boolean('is_paid').default(false),
  paidAt: timestamp('paid_at'),

  // Tracking
  firstEventId: uuid('first_event_id').references(() => events.id),
  conversionCount: integer('conversion_count').default(0),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
});

export default referrals;
