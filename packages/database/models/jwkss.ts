import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const jwkss = pgTable(
  'jwkss',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    publicKey: text('public_key').notNull(),
    privateKey: text('private_key').notNull(),
    createdAt: timestamp('created_at').notNull().default(sql`now()`),
  },
  (table) => ({
    jwkssIdIdx: index('jwkss_id_idx').on(table.id),
    publicKeyIdx: index('jwkss_public_key_idx').on(table.publicKey),
    privateKeyIdx: index('jwkss_private_key_idx').on(table.privateKey),
  })
);
