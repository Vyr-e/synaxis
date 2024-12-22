import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { notificationType } from './enums';
import { events } from './events';
import { users } from './users';

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  eventId: uuid('event_id').references(() => events.id, {
    onDelete: 'cascade',
  }),
  type: notificationType('type').notNull(),
  message: varchar('message', { length: 1000 }).notNull(),
  isRead: boolean('is_read').default(false),
  sentAt: timestamp('sent_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export default notifications;
