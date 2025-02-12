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
import { purchaseStatus, ticketDiscountType } from './enums';
import { events } from './events';
import { users } from './users';

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
      design?: string;
      color?: string;
      logo?: string;
      image?: string;
    }>(),

    // Timestamps
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
  },
  (table) => ({
    tktEventIdx: index('tkt_event_idx').on(table.eventId),
    tktTypeIdx: index('tkt_type_idx').on(table.type),
    tktActiveIdx: index('tkt_active_idx').on(table.isActive),
    tktDateIdx: index('tkt_date_idx').on(
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
    type: ticketDiscountType('type').notNull().default('percentage'),
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
    discCodeIdx: index('disc_code_idx').on(table.code),
    discTicketIdx: index('disc_ticket_idx').on(table.ticketId),
    discDateIdx: index('disc_date_idx').on(table.startDate, table.endDate),
  })
);

export const ticketPurchases = pgTable(
  'ticket_purchases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id')
      .notNull()
      .references(() => tickets.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id),
    quantity: integer('quantity').notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    status: purchaseStatus('status').notNull().default('pending'),
    attendeeDetails: jsonb('attendee_details').$type<{
      name: string;
      email: string;
      phone?: string;
    }>(),
    accessCode: varchar('access_code', { length: 100 }).notNull().unique(),
    isUsed: boolean('is_used').default(false),
    expiresAt: timestamp('expires_at'),
    purchasedAt: timestamp('purchased_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),
    discountId: uuid('discount_id').references(() => ticketDiscounts.id),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }),
    originalPrice: decimal('original_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    finalPrice: decimal('final_price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => ({
    purchTicketIdx: index('purch_ticket_idx').on(table.ticketId),
    purchUserIdx: index('purch_user_idx').on(table.userId),
    purchEventIdx: index('purch_event_idx').on(table.eventId),
    purchStatusIdx: index('purch_status_idx').on(table.status),
    purchAccessCodeIdx: index('purch_access_code_idx').on(table.accessCode),
  })
);

export default tickets;
