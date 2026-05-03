import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contacts } from "@db/schema";
import { eq, desc, sql, like, or } from "drizzle-orm";

export const contactRouter = createRouter({
  list: adminQuery
    .input(
      z
        .object({
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
      if (input?.search) {
        const term = `%${input.search}%`;
        conditions.push(
          or(
            like(contacts.name, term),
            like(contacts.email, term),
            like(contacts.subject, term),
            like(contacts.message, term)
          )
        );
      }

      const where = conditions.length > 0 ? or(...conditions) : undefined;

      const items = await db
        .select()
        .from(contacts)
        .where(where)
        .orderBy(desc(contacts.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(contacts)
        .where(where);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [{ id }] = await db.insert(contacts).values(input).$returningId();
      const result = await db
        .select()
        .from(contacts)
        .where(eq(contacts.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(contacts).where(eq(contacts.id, input.id));
      return { success: true };
    }),
});
