import { sql } from 'drizzle-orm';
import { index, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { collaborationRole } from './enums';
import { organizations } from './organization';
import { users } from './users';

export const members = pgTable(
  'members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: collaborationRole('role').default('member'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at').default(sql`now()`).notNull(),
  },
  (table) => ({
    memberOrgIdx: index('member_org_idx').on(table.organizationId),
    memberUserIdx: index('member_user_idx').on(table.userId),
    memberRoleIdx: index('member_role_idx').on(table.role),
  })
);
