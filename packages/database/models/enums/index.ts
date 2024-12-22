import { pgEnum } from 'drizzle-orm/pg-core';

export const accountType = pgEnum('account_type', [
  'oauth',
  'email',
  'phone',
  'passwordless',
]);

export const ticketDiscountType = pgEnum('ticket_discount_type', [
  'percentage',
  'fixed',
]);

export const purchaseStatus = pgEnum('purchase_status', [
  'pending',
  'confirmed',
  'cancelled',
  'refunded',
]);

export const notificationType = pgEnum('notification_type', [
  'reminder',
  'feedback',
  'update',
  'collaboration',
  'chat',
]);

export const collaborationType = pgEnum('collaboration_type', [
  'sponsor',
  'artist',
  'vendor',
  'organizer',
  'staff',
]);

export const collaborationRole = pgEnum('collaboration_role', [
  'owner',
  'admin',
  'moderator',
  'member',
  'guest',
]);

export const mediaType = pgEnum('media_type', ['image', 'audio', 'video']);

export const referralStatus = pgEnum('referral_status', [
  'pending',
  'completed',
  'expired',
]);

export const userRole = pgEnum('user_role', [
  'admin',
  'organizer',
  'user',
  'guest',
]);
