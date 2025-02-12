import { sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    logo: text('logo'),
    url: text('url').unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    metadata: text('metadata'),
  },
  (table) => ({
    slugIdx: index('org_slug_idx').on(table.slug),
    nameIdx: index('org_name_idx').on(table.name),
  })
);

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
    role: varchar('role', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    memberOrgIdx: index('member_org_idx').on(table.organizationId),
    memberUserIdx: index('member_user_idx').on(table.userId),
    memberRoleIdx: index('member_role_idx').on(table.role),
  })
);

export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    email: varchar('email', { length: 256 }).notNull(),
    role: varchar('role', { length: 50 }),
    status: varchar('status', { length: 50 }).notNull(),
    token: varchar('token', { length: 100 }).notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    inviterId: uuid('inviter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    inviteOrgIdx: index('invite_org_idx').on(table.organizationId),
    inviteEmailIdx: index('invite_email_idx').on(table.email),
    inviteStatusIdx: index('invite_status_idx').on(table.status),
    inviteTokenIdx: index('invite_token_idx').on(table.token),
  })
);
