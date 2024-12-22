import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const events = pgTable(
  'events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    // Basic Info
    title: varchar('title', { length: 256 }).notNull(),
    description: text('description'),
    slug: varchar('slug', { length: 256 }).notNull().unique(),

    // Dates
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),

    // Location
    location: varchar('location', { length: 256 }),
    venue: varchar('venue', { length: 256 }),
    coordinates: jsonb('coordinates').$type<{
      lat: number;
      lng: number;
    }>(),

    // Capacity & Status
    capacity: integer('capacity'),
    isPublished: boolean('is_published').default(false),
    isFeatured: boolean('is_featured').default(false),
    isSoldOut: boolean('is_sold_out').default(false),

    // Pricing
    basePrice: decimal('base_price', { precision: 10, scale: 2 }),
    currency: varchar('currency', { length: 3 }).default('USD'),

    // Media
    coverImage: varchar('cover_image', { length: 500 }),
    images: jsonb('images').$type<string[]>(),

    // Metadata
    category: varchar('category', { length: 50 }),
    tags: jsonb('tags').$type<string[]>(),

    // Relations
    organizerId: uuid('organizer_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    slugIdx: index('event_slug_idx').on(table.slug),
    categoryIdx: index('event_category_idx').on(table.category),
    organizerIdx: index('event_organizer_idx').on(table.organizerId),
    dateIdx: index('event_date_idx').on(table.startDate, table.endDate),
    locationIdx: index('event_location_idx').on(table.location),
    publishedIdx: index('event_published_idx').on(table.isPublished),
  })
);

export default events;
