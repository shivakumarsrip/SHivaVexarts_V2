import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const collections = await sql`SELECT collection, count(*) as count FROM artworks GROUP BY collection`;
    console.log('Collections usage:', collections);
    
    const categories = await sql`SELECT category, count(*) as count FROM artworks GROUP BY category`;
    console.log('Categories usage:', categories);
  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
