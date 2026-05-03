import "dotenv/config";
import postgres from "postgres";

const url = process.env.DATABASE_URL;

async function test() {
  if (!url) return;
  const sql = postgres(url);
  try {
    const result = await sql`SELECT id, title, collection, category, "imageUrl" FROM artworks LIMIT 10`;
    console.log("Data:", result);
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await sql.end();
  }
}

test();
