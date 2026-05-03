import "dotenv/config";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
console.log("Testing connection to:", url?.split("@")[1]);

async function test() {
  if (!url) {
    console.error("No DATABASE_URL found");
    return;
  }
  const sql = postgres(url, { timeout: 10 });
  try {
    const result = await sql`SELECT 1 as connected`;
    console.log("Result:", result);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await sql.end();
  }
}

test();
