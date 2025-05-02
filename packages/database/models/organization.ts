import { sql } from 'drizzle-orm';
import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const organizations = pgTable(
  'organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    logo: text('logo'),
    url: text('url').unique(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    metadata: text('metadata'), // Consider using jsonb if metadata is structured
  },
  (table) => ({
    slugIdx: index('org_slug_idx').on(table.slug),
    nameIdx: index('org_name_idx').on(table.name),
  })
);
