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

// Define role types for type safety
export const USER_ROLES = {
  GUEST: 'guest', // Users with incomplete profiles
  USER: 'user', // Regular users with complete profiles
  BRAND_OWNER: 'brand_owner', // Users who own brands
  MODERATOR: 'moderator', // Community moderators
  ADMIN: 'admin', // Platform administrators
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const USER_PROFILE_STEPS = {
  SIGNUP: 'signup',
  ONBOARD: 'onboard',
  COMPLETED: 'completed',
} as const;

export type UserProfileStep =
  (typeof USER_PROFILE_STEPS)[keyof typeof USER_PROFILE_STEPS];

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

    name: text('name').notNull(),
    firstName: varchar('first_name', { length: 256 }),
    lastName: varchar('last_name', { length: 256 }),
    username: varchar('username', { length: 256 }).unique(),
    displayName: varchar('display_name', { length: 256 }),
    displayUsername: varchar('display_username', { length: 256 }).unique(),
    email: varchar('email', { length: 256 }).notNull().unique(),
    emailVerified: boolean('email_verified')
      .notNull()
      .default(false)
      .$defaultFn(() => sql`USING email_verified::boolean`),
    image: text('image'),
    bio: varchar('bio', { length: 500 }),

    // Location
    location: varchar('location', { length: 256 }),

    // Social links
    instagram: varchar('instagram', { length: 256 }),
    twitter: varchar('twitter', { length: 256 }),
    facebook: varchar('facebook', { length: 256 }),
    linkedin: varchar('linkedin', { length: 256 }),
    website: varchar('website', { length: 500 }),

    // Privacy settings
    isProfilePublic: boolean('is_profile_public').default(true),
    showLocation: boolean('show_location').default(true),
    allowMessages: boolean('allow_messages').default(true),

    // Interests and customization
    interests: jsonb('interests').$type<string[]>().default([]),
    bannerImage: text('banner_image'),
    bannerColor: varchar('banner_color', { length: 7 }).default('#0057FF'),

    preferences: jsonb('preferences').$type<UserPreferences>().default({}),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    deletedAt: timestamp('deleted_at'),

    // Role as varchar with default guest for incomplete profiles
    role: varchar('role', { length: 50 })
      .$type<UserRole>()
      .default(USER_ROLES.GUEST)
      .notNull(),

    // Brand relationship - will be linked via relations.ts to avoid circular dependency
    brandId: uuid('brand_id'),

    banned: boolean('banned').default(false),
    banReason: text('ban_reason'),
    banExpires: timestamp('ban_expires'),

    // User profile step
    userProfileStep: varchar('user_profile_step', { length: 50 })
      .$type<UserProfileStep>()
      .default(USER_PROFILE_STEPS.SIGNUP)
      .notNull(),
  },
  (table) => ({
    emailIdx: index('email_idx').on(table.email),
    usernameIdx: index('username_idx').on(table.username),
    usernameUnique: unique('username_unique').on(table.username),
    displayUsernameUnique: unique('display_username_unique').on(
      table.displayUsername
    ),
  })
);
