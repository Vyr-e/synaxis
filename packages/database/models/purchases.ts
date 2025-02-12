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
import { purchaseStatus } from './enums';
import { events } from './events';
import { ticketDiscounts, tickets } from './tickets';
import { users } from './users';

export const ticketPurchases = pgTable(
  'ticket_purchases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id')
      .notNull()
      .references(() => tickets.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'no action',
      }),
    eventId: uuid('event_id')
      .notNull()
      .references(() => events.id, {
        onDelete: 'no action',
        onUpdate: 'no action',
      }),

    // Purchase Info
    quantity: integer('quantity').notNull(),
    totalPrice: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
    status: purchaseStatus('status').notNull().default('pending'),

    // Attendee Info
    attendeeDetails: jsonb('attendee_details').$type<{
      name: string;
      email: string;
      phone?: string;
    }>(),

    // QR Code/Ticket Access
    accessCode: varchar('access_code', { length: 100 }).notNull().unique(),
    isUsed: boolean('is_used').default(false),

    expiresAt: timestamp('expires_at'),

    // Timestamps
    purchasedAt: timestamp('purchased_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().default(sql`now()`),

    // Discount tracking
    discountId: uuid('discount_id').references(() => ticketDiscounts.id),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }),
    originalPrice: decimal('original_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    finalPrice: decimal('final_price', { precision: 10, scale: 2 }).notNull(),
  },
  (table) => ({
    ticketIdx: index('purchase_ticket_idx').on(table.ticketId),
    userIdx: index('purchase_user_idx').on(table.userId),
    eventIdx: index('purchase_event_idx').on(table.eventId),
    statusIdx: index('purchase_status_idx').on(table.status),
    accessCodeIdx: index('purchase_access_code_idx').on(table.accessCode),
  })
);

export default ticketPurchases;
