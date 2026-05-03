import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { siteSettings } from "../db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  getAll: publicQuery.query(async ({ ctx }) => {
    const results = await ctx.db.select().from(siteSettings);
    // Convert to a record for easier usage
    const settings: Record<string, any> = {};
    results.forEach((row) => {
      try {
        settings[row.key] = JSON.parse(row.value);
      } catch (e) {
        settings[row.key] = row.value;
      }
    });
    return settings;
  }),

  update: adminQuery
    .input(
      z.object({
        key: z.string(),
        value: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const jsonValue = JSON.stringify(input.value);
      
      await ctx.db
        .insert(siteSettings)
        .values({
          key: input.key,
          value: jsonValue,
        })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value: jsonValue },
        });

      return { success: true };
    }),
});
