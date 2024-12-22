import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { ticketDiscountType } from './enums';
import { events } from './events';

export const tickets = pgTable(
  'tickets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),

    // Ticket Info
    name: varchar('name', { length: 100 }).notNull(),
    description: varchar('description', { length: 500 }),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    quantitySold: integer('quantity_sold').default(0),
    maxPerUser: integer('max_per_user').default(1), // Limit tickets per user

    // Ticket Type
    type: varchar('type', { length: 50 }).notNull(), // VIP, Regular, etc.

    // Validity
    saleStartDate: timestamp('sale_start_date'),
    saleEndDate: timestamp('sale_end_date'),

    // Status
    isActive: boolean('is_active').default(true),

    // Design
    template: jsonb('template').$type<{
      design: string;
      color: string;
      logo?: string;
    }>(),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    eventIdx: index('ticket_event_idx').on(table.eventId),
    typeIdx: index('ticket_type_idx').on(table.type),
    activeIdx: index('ticket_active_idx').on(table.isActive),
    dateIdx: index('ticket_date_idx').on(
      table.saleStartDate,
      table.saleEndDate
    ),
  })
);

export const ticketDiscounts = pgTable(
  'ticket_discounts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id')
      .notNull()
      .references(() => tickets.id, { onDelete: 'cascade' }),

    // Discount Info
    code: varchar('code', { length: 50 }).notNull().unique(),
    type: ticketDiscountType('type').notNull(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),

    // Limits
    maxUses: integer('max_uses'), // null means unlimited
    usedCount: integer('used_count').default(0),
    maxPerUser: integer('max_per_user').default(1),

    // Validity
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),

    // Status
    isActive: boolean('is_active').default(true),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    codeIdx: index('discount_code_idx').on(table.code),
    ticketIdx: index('discount_ticket_idx').on(table.ticketId),
    dateIdx: index('discount_date_idx').on(table.startDate, table.endDate),
  })
);

export default tickets;
