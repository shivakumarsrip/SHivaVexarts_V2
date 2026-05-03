import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const artworks = await sql`SELECT collection, category FROM artworks`;
    
    const collections = [...new Set(artworks.map(a => a.collection))].sort();
    const categories = [...new Set(artworks.map(a => a.category))].sort();

    console.log('Unique Collections in DB:', collections);
    console.log('Unique Categories in DB:', categories);
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
