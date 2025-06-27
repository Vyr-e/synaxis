import { relations } from 'drizzle-orm';
import { brands } from './models/brands';
import { users } from './models/users';

export const usersRelations = relations(users, ({ one }) => ({
  brand: one(brands, {
    fields: [users.brandId],
    references: [brands.id],
  }),
}));

export const brandsRelations = relations(brands, ({ one, many }) => ({
  owner: one(users, {
    fields: [brands.ownerId],
    references: [users.id],
  }),
  users: many(users),
}));
