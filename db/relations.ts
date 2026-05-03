import { relations } from "drizzle-orm";
import { users, artworks, orders, orderItems } from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const artworksRelations = relations(artworks, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  artwork: one(artworks, { fields: [orderItems.artworkId], references: [artworks.id] }),
}));
