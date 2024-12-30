import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { accountType } from './enums';
import { users } from './users';

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade', // Delete accounts when user is deleted
        onUpdate: 'cascade', // Update if user ID changes
      }),

    // Auth info
    type: accountType('type').notNull().default('email'),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    password: text('password'),
    twoFactorSecret: text('twoFactorSecret'),
    twoFactorEnabled: boolean('twoFactorEnabled').default(false),

    // OAuth specific
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),

    // Token expiration tracking
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

    // Timestamps
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (account) => ({
    // Allow multiple providers per user
    providerUserIdx: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    // Index for quick user lookups
    userIdx: index('user_account_idx').on(account.userId),
  })
);

export default accounts;
