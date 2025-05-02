import { relations } from 'drizzle-orm';
import { accounts } from '../models/accounts';
import { eventMetrics } from '../models/analytics';
import { brands } from '../models/brands';
import { chatMessages, chatParticipants, chatRooms } from '../models/chat';
import { collaborations, eventFaqs } from '../models/collaborations';
import { events } from '../models/events';
import { invitations } from '../models/invitations';
import { eventMedia } from '../models/media';
import { members } from '../models/members';
import { notifications } from '../models/notifications';
import { organizations } from '../models/organization';
import { ticketPurchases } from '../models/purchases';
import { referrals } from '../models/referrals';
import { sessions } from '../models/sessions';
import { ticketDiscounts, tickets } from '../models/tickets';
import { users } from '../models/users';

// User Relations (Combined and Updated)
export const usersRelations = relations(users, ({ many, one }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  memberships: many(members),
  sentInvitations: many(invitations, { relationName: 'inviter' }),
  brand: one(brands, {
    fields: [users.brandId],
    references: [brands.id],
  }),
  // Existing app relations
  events: many(events, { relationName: 'organizer' }),
  tickets: many(ticketPurchases), // Assuming this relates user to purchases
  notifications: many(notifications),
  collaborations: many(collaborations),
  chatParticipation: many(chatParticipants),
  messages: many(chatMessages),
  media: many(eventMedia),
  referralsGiven: many(referrals, { relationName: 'referrer' }),
  referralsReceived: many(referrals, { relationName: 'referred' }),
}));

// Event Relations
export const eventRelations = relations(events, ({ one, many }) => ({
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
    relationName: 'organizer', // Specify relation name if ambiguous
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

// --- Auth & Organization Relations --- //

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

// Organization Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  invitations: many(invitations),
}));

// Member Relations
export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

// Invitation Relations
export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  inviter: one(users, {
    fields: [invitations.inviterId],
    references: [users.id],
    relationName: 'inviter',
  }),
}));
