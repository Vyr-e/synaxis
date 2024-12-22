import {
  decimal,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { events } from './events';

export const eventMetrics = pgTable(
  'event_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    viewCount: integer('view_count').default(0),
    ticketsSold: integer('tickets_sold').default(0),
    revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0'),
    lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  },
  (table) => ({
    eventIdx: index('metrics_event_idx').on(table.eventId),
  })
);

export default eventMetrics;
