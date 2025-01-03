import { relations } from 'drizzle-orm';
import { sessions } from 'models/sessions';
import { accounts } from '../models/accounts';
import { eventMetrics } from '../models/analytics';
import { chatMessages, chatParticipants, chatRooms } from '../models/chat';
import { collaborations, eventFaqs } from '../models/collaborations';
import { events } from '../models/events';
import { eventMedia } from '../models/media';
import { notifications } from '../models/notifications';
import { ticketPurchases } from '../models/purchases';
import { referrals } from '../models/referrals';
import { ticketDiscounts, tickets } from '../models/tickets';
import { users } from '../models/users';

// User Relations
export const userRelations = relations(users, ({ many }) => ({
  events: many(events, { relationName: 'organizer' }),
  tickets: many(ticketPurchases),
  notifications: many(notifications),
  collaborations: many(collaborations),
  chatParticipation: many(chatParticipants),
  messages: many(chatMessages),
  media: many(eventMedia),
  accounts: many(accounts),
  referralsGiven: many(referrals, { relationName: 'referrer' }),
  referralsReceived: many(referrals, { relationName: 'referred' }),
}));

// Event Relations
export const eventRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  tickets: many(tickets),
  collaborations: many(collaborations),
  chatRooms: many(chatRooms),
  media: many(eventMedia),
  faqs: many(eventFaqs),
  metrics: one(eventMetrics),
  purchases: many(ticketPurchases),
}));

// Ticket Relations
export const ticketRelations = relations(tickets, ({ one, many }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  discounts: many(ticketDiscounts),
  purchases: many(ticketPurchases),
}));

// Chat Relations
export const chatRoomRelations = relations(chatRooms, ({ one, many }) => ({
  event: one(events, {
    fields: [chatRooms.eventId],
    references: [events.id],
  }),
  messages: many(chatMessages),
  participants: many(chatParticipants),
}));

// Collaboration Relations
export const collaborationRelations = relations(collaborations, ({ one }) => ({
  event: one(events, {
    fields: [collaborations.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [collaborations.userId],
    references: [users.id],
  }),
}));

// Purchase Relations
export const purchaseRelations = relations(ticketPurchases, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketPurchases.ticketId],
    references: [tickets.id],
  }),
  event: one(events, {
    fields: [ticketPurchases.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [ticketPurchases.userId],
    references: [users.id],
  }),
  discount: one(ticketDiscounts, {
    fields: [ticketPurchases.discountId],
    references: [ticketDiscounts.id],
  }),
}));

// Add auth relations
export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  // Keep existing relations
  events: many(events),
  collaborations: many(collaborations),
  chatParticipants: many(chatParticipants),
  notifications: many(notifications),
  ticketPurchases: many(ticketPurchases),
  referralsAsReferrer: many(referrals, { relationName: 'referrer' }),
  referralsAsReferred: many(referrals, { relationName: 'referred' }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
