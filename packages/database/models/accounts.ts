import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    id: uuid('id').defaultRandom().primaryKey(),

    // Auth info
    providerId: text('providerId').notNull(),
    provider: text('provider').notNull().default('credentials'),
    accountId: text('accountId').notNull(),
    password: text('password'),
    twoFactorSecret: text('twoFactorSecret'),
    twoFactorEnabled: boolean('twoFactorEnabled').default(false),

    // OAuth specific
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),

    // Token expiration tracking
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

    // Timestamps
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (account) => ({
    // Use composite primary key only

    // Keep index for performance
    userIdx: index('user_account_idx').on(account.userId),
  })
);

export default accounts;
