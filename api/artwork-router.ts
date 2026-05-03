import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { artworks } from "@db/schema";
import { eq, like, desc, and, or, sql } from "drizzle-orm";

export const artworkRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          category: z.string().optional(),
          collection: z.string().optional(),
          featured: z.boolean().optional(),
          search: z.string().optional(),
          limit: z.number().min(1).max(1000).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const limit = input?.limit ?? 50;
      const offset = input?.offset ?? 0;

      const conditions = [];
      if (input?.category) {
        conditions.push(eq(artworks.category, input.category));
      }
      if (input?.collection) {
        conditions.push(eq(artworks.collection, input.collection));
      }
      if (input?.featured !== undefined) {
        conditions.push(eq(artworks.featured, input.featured));
      }
      if (input?.search) {
        const term = `%${input.search}%`;
        conditions.push(
          or(
            like(artworks.title, term),
            like(artworks.description, term),
            like(artworks.category, term)
          )
        );
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const items = await db
        .select()
        .from(artworks)
        .where(where)
        .orderBy(desc(artworks.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(artworks)
        .where(where);

      return { items, total: countResult[0]?.count ?? 0 };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(artworks)
        .where(eq(artworks.slug, input.slug))
        .limit(1);
      return result[0] ?? null;
    }),

  categories: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ category: artworks.category })
      .from(artworks)
      .groupBy(artworks.category);
    return result.map((r) => r.category);
  }),

  collections: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ collection: artworks.collection })
      .from(artworks)
      .where(sql`${artworks.collection} IS NOT NULL`)
      .groupBy(artworks.collection);
    return result.map((r) => r.collection).filter(Boolean);
  }),

  create: adminQuery
    .input(
      z.object({
        slug: z.string().min(1),
        title: z.string().min(1),
        category: z.string().min(1),
        collection: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().min(1),
        basePrice: z.string().min(1),
        year: z.number().optional(),
        dimensions: z.string().optional(),
        format: z.string().optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [result] = await db.insert(artworks).values(input).returning();
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        slug: z.string().min(1).optional(),
        title: z.string().min(1).optional(),
        category: z.string().min(1).optional(),
        collection: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        imageUrl: z.string().min(1).optional(),
        basePrice: z.string().min(1).optional(),
        year: z.number().optional().nullable(),
        dimensions: z.string().optional().nullable(),
        format: z.string().optional().nullable(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(artworks).set(data).where(eq(artworks.id, id));
      const result = await db
        .select()
        .from(artworks)
        .where(eq(artworks.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(artworks).where(eq(artworks.id, input.id));
      return { success: true };
    }),

  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(artworks).limit(1);
    if (existing.length > 0) {
      return { seeded: false, message: "Already seeded" };
    }

    const seedArtworks = [
      {
        slug: "untamed-opulence",
        title: "Untamed Opulence",
        category: "Abstract",
        collection: "Luxury Series",
        description: "A mesmerizing interplay of liquid gold and deep navy textures that evoke the raw beauty of natural marble formations.",
        imageUrl: "/images/artwork-1.jpg",
        basePrice: "12500.00",
        year: 2024,
        dimensions: "24 x 36 inches",
        format: "Digital Print",
        featured: true,
      },
      {
        slug: "crystal-dreamscape",
        title: "Crystal Dreamscape",
        category: "Surrealism",
        collection: "Fantasy Realms",
        description: "Floating crystal islands suspended in a twilight aurora, where gravity surrenders to imagination.",
        imageUrl: "/images/artwork-2.jpg",
        basePrice: "15800.00",
        year: 2024,
        dimensions: "30 x 40 inches",
        format: "Digital Print",
        featured: true,
      },
      {
        slug: "neon-drifter",
        title: "Neon Drifter",
        category: "Cyberpunk",
        collection: "Urban Futures",
        description: "A lone wanderer navigates the rain-soaked streets of a hyper-technological metropolis.",
        imageUrl: "/images/artwork-3.jpg",
        basePrice: "11200.00",
        year: 2025,
        dimensions: "24 x 36 inches",
        format: "Digital Print",
        featured: true,
      },
      {
        slug: "bioluminescent-grove",
        title: "Bioluminescent Grove",
        category: "Fantasy",
        collection: "Nature Reimagined",
        description: "An enchanted forest where ancient trees wear silver bark and glowing mushrooms light the path.",
        imageUrl: "/images/artwork-4.jpg",
        basePrice: "9800.00",
        year: 2024,
        dimensions: "20 x 30 inches",
        format: "Digital Print",
        featured: false,
      },
      {
        slug: "equilibrium",
        title: "Equilibrium",
        category: "Geometric",
        collection: "Minimalist Forms",
        description: "Interlocking spheres and pyramids in perfect mathematical harmony.",
        imageUrl: "/images/artwork-5.jpg",
        basePrice: "14200.00",
        year: 2025,
        dimensions: "28 x 28 inches",
        format: "Digital Print",
        featured: true,
      },
      {
        slug: "fragmented-identity",
        title: "Fragmented Identity",
        category: "Portrait",
        collection: "Human Condition",
        description: "A contemporary portrait dissolving into ink and emotion.",
        imageUrl: "/images/artwork-6.jpg",
        basePrice: "18900.00",
        year: 2025,
        dimensions: "24 x 36 inches",
        format: "Digital Print",
        featured: true,
      },
    ];

    await db.insert(artworks).values(seedArtworks);
    return { seeded: true, count: seedArtworks.length };
  }),
});
