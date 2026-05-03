import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  integer,
  boolean,
  decimal,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const orderStatusEnum = pgEnum("status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

// Users

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Artworks ──────────────────────────────────────────────────────────────

export const artworks = pgTable(
  "artworks",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    collection: varchar("collection", { length: 100 }),
    description: text("description"),
    imageUrl: text("imageUrl").notNull(),
    basePrice: decimal("basePrice", { precision: 12, scale: 2 }).notNull(),
    year: integer("year"),
    dimensions: varchar("dimensions", { length: 100 }),
    format: varchar("format", { length: 50 }),
    featured: boolean("featured").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    slugIdx: index("slug_idx").on(table.slug),
    categoryIdx: index("category_idx").on(table.category),
    featuredIdx: index("featured_idx").on(table.featured),
  })
);

export type Artwork = typeof artworks.$inferSelect;
export type InsertArtwork = typeof artworks.$inferInsert;

// ─── Orders ────────────────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
    userId: bigint("userId", { mode: "number" }),
    customerName: varchar("customerName", { length: 255 }).notNull(),
    customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
    customerPhone: varchar("customerPhone", { length: 50 }),
    shippingAddress: text("shippingAddress").notNull(),
    shippingCity: varchar("shippingCity", { length: 100 }).notNull(),
    shippingCountry: varchar("shippingCountry", { length: 100 }).notNull(),
    shippingRegion: integer("shippingRegion").notNull(),
    totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
    shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    paymentReference: varchar("paymentReference", { length: 255 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orderNumberIdx: index("order_number_idx").on(table.orderNumber),
    userIdIdx: index("order_user_idx").on(table.userId),
    statusIdx: index("status_idx").on(table.status),
  })
);

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// ─── Order Items ───────────────────────────────────────────────────────────

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: bigint("orderId", { mode: "number" }).notNull(),
    artworkId: bigint("artworkId", { mode: "number" }).notNull(),
    selectedSize: varchar("selectedSize", { length: 50 }).notNull(),
    quantity: integer("quantity").notNull(),
    unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
    totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_item_order_idx").on(table.orderId),
    artworkIdIdx: index("order_item_artwork_idx").on(table.artworkId),
  })
);

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// ─── Contacts ──────────────────────────────────────────────────────────────

export const contacts = pgTable(
  "contacts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("contact_email_idx").on(table.email),
    createdIdx: index("contact_created_idx").on(table.createdAt),
  })
);

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
// ─── Site Settings ────────────────────────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value").notNull(), // JSON string
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;
