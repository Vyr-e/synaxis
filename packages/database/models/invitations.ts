import { sql } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { collaborationRole, referralStatus } from './enums';
import { organizations } from './organization';
import { users } from './users';

export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 256 }).notNull(),
    role: collaborationRole('role').default('member'),
    status: referralStatus('status').default('pending'),
    token: varchar('token', { length: 100 }).notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    inviterId: uuid('inviter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }), // Link to the user who sent the invite
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => ({
    inviteOrgIdx: index('invite_org_idx').on(table.organizationId),
    inviteEmailIdx: index('invite_email_idx').on(table.email),
    inviteStatusIdx: index('invite_status_idx').on(table.status),
    inviteTokenIdx: index('invite_token_idx').on(table.token),
  })
);
