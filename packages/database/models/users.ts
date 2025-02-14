import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { brands } from './brands';
import { userRole } from './enums';

// Define preference types for type safety
export type UserPreferences = {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
  accessibility?: {
    reduceMotion?: boolean;
    highContrast?: boolean;
  };
  privacy?: {
    profileVisibility?: 'public' | 'private' | 'friends';
    showOnlineStatus?: boolean;
  };
};

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
    username: varchar('username', { length: 256 }).unique(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    emailVerified: boolean('email_verified')
      .notNull()
      .default(false)
      .$defaultFn(() => sql`USING email_verified::boolean`),
    image: text('image'),
    bio: varchar('bio', { length: 500 }),
    preferences: jsonb('preferences').$type<UserPreferences>().default({}),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),
    role: userRole('role').default('user').notNull(),
    brandId: uuid('brand_id').references(() => brands.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username),
    usernameUnique: unique('username_unique').on(table.username),
  })
);
