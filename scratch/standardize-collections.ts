import "dotenv/config";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Standardizing collection IDs...');
    
    const res1 = await sql`UPDATE artworks SET collection = 'fan_art' WHERE collection = 'Superheros'`;
    console.log(`Updated ${res1.count} 'Superheros' to 'fan_art'`);
    
    const res2 = await sql`UPDATE artworks SET collection = 'client_works' WHERE collection = 'Client Works'`;
    console.log(`Updated ${res2.count} 'Client Works' to 'client_works'`);
    
    const res3 = await sql`UPDATE artworks SET collection = 'digital_illustrations' WHERE collection = 'conceptual_illustrations'`;
    console.log(`Updated ${res3.count} 'conceptual_illustrations' to 'digital_illustrations'`);

  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
