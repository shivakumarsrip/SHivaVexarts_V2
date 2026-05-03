import { getDb } from "../api/queries/connection";
import { artworks } from "./schema";

async function seed() {
  const db = getDb();

  const existing = await db.select().from(artworks).limit(1);
  if (existing.length > 0) {
    console.log("Artworks already seeded, skipping.");
    return;
  }

  const seedArtworks = [
    {
      slug: "untamed-opulence",
      title: "Untamed Opulence",
      category: "Abstract",
      collection: "Luxury Series",
      description: "A mesmerizing interplay of liquid gold and deep navy textures that evoke the raw beauty of natural marble formations. This piece explores the tension between chaos and refinement.",
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
      description: "Floating crystal islands suspended in a twilight aurora, where gravity surrenders to imagination. A portal to worlds beyond our own.",
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
      description: "A lone wanderer navigates the rain-soaked streets of a hyper-technological metropolis. Neon reflections tell stories of isolation and wonder.",
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
      description: "An enchanted forest where ancient trees wear silver bark and glowing mushrooms light the path to forgotten civilizations.",
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
      description: "Interlocking spheres and pyramids in perfect mathematical harmony. A meditation on balance, proportion, and the beauty of pure form.",
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
      description: "A contemporary portrait dissolving into ink and emotion. The single crimson accent speaks to the depth hidden beneath composed surfaces.",
      imageUrl: "/images/artwork-6.jpg",
      basePrice: "18900.00",
      year: 2025,
      dimensions: "24 x 36 inches",
      format: "Digital Print",
      featured: true,
    },
  ];

  await db.insert(artworks).values(seedArtworks);
  console.log(`Seeded ${seedArtworks.length} artworks.`);
}

seed().catch(console.error);
