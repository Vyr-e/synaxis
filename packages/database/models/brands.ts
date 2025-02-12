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

export const brands = pgTable(
  'brands',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 256 }).notNull().unique(),
    description: text('description'),
    logo: text('logo'),
    website: varchar('website', { length: 500 }),
    isVerified: boolean('is_verified').default(false),
    ownerId: uuid('owner_id').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    slugIdx: index('brand_slug_idx').on(table.slug),
    ownerIdx: index('brand_owner_idx').on(table.ownerId),
  })
);

export const brandCommunities = pgTable(
  'brand_communities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    brandId: uuid('brand_id')
      .notNull()
      .references(() => brands.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 256 }).notNull(),
    description: text('description'),
    isPrivate: boolean('is_private').default(false),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    brandIdx: index('community_brand_idx').on(table.brandId),
  })
);

export const communityMembers = pgTable(
  'community_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    communityId: uuid('community_id')
      .notNull()
      .references(() => brandCommunities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull(),
    role: varchar('role', { length: 50 }).default('member').notNull(),
    joinedAt: timestamp('joined_at').notNull().default(sql`now()`),
  },
  (table) => ({
    membershipIdx: index('community_member_idx').on(
      table.communityId,
      table.userId
    ),
  })
);

export default brands;
