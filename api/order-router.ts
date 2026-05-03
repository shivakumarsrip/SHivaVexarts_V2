import { z } from "zod";
import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, orderItems } from "@db/schema";
import { eq, desc, and, sql, like, or } from "drizzle-orm";

function generateOrderNumber(): string {
  const prefix = "ORD";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export const orderRouter = createRouter({
  list: adminQuery
    .input(
      z
        .object({
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const conditions = [];
      if (input?.status) {
        conditions.push(eq(orders.status, input.status as "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"));
      }
      if (input?.search) {
        const term = `%${input.search}%`;
        conditions.push(
          or(
            like(orders.orderNumber, term),
            like(orders.customerName, term),
            like(orders.customerEmail, term)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(orders)
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(where);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  myOrders: authedQuery
    .input(
      z
        .object({
          limit: z.number().min(1).max(50).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const items = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, ctx.user.id))
        .orderBy(desc(orders.createdAt))
        .limit(limit)
        .offset(offset);

      return { items };
    }),

  byId: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      if (!orderResult[0]) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, input.id));

      return { order: orderResult[0], items };
    }),

  byOrderNumber: publicQuery
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, input.orderNumber))
        .limit(1);

      if (!orderResult[0]) return null;

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderResult[0].id));

      return { order: orderResult[0], items };
    }),

  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingAddress: z.string().min(1),
        shippingCity: z.string().min(1),
        shippingCountry: z.string().min(1),
        shippingRegion: z.number().min(1).max(4),
        totalAmount: z.string().min(1),
        shippingCost: z.string().min(1),
        paymentMethod: z.string().optional(),
        items: z.array(
          z.object({
            artworkId: z.number(),
            selectedSize: z.string(),
            quantity: z.number().min(1),
            unitPrice: z.string(),
            totalPrice: z.string(),
          })
        ),
        userId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const orderNumber = generateOrderNumber();

      const [{ id: orderId }] = await db
        .insert(orders)
        .values({
          orderNumber,
          userId: input.userId ?? null,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone ?? null,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingCountry: input.shippingCountry,
          shippingRegion: input.shippingRegion,
          totalAmount: input.totalAmount,
          shippingCost: input.shippingCost,
          status: "pending",
          paymentMethod: input.paymentMethod ?? null,
        })
        .$returningId();

      if (input.items.length > 0) {
        await db.insert(orderItems).values(
          input.items.map((item) => ({
            orderId,
            artworkId: item.artworkId,
            selectedSize: item.selectedSize,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          }))
        );
      }

      const orderResult = await db
        .select()
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);

      return { order: orderResult[0], orderNumber };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.id))
        .limit(1);

      return result[0];
    }),

  simulatePayment: publicQuery
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      await db
        .update(orders)
        .set({
          status: "paid",
          paymentMethod: "Simulated Card",
          paymentReference,
        })
        .where(eq(orders.id, input.orderId));

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      return result[0];
    }),
});
