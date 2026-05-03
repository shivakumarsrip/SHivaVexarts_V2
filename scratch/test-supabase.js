import postgres from 'postgres';
import 'dotenv/config';

async function testConnection() {
  try {
    const sql = postgres(process.env.DATABASE_URL, {
      ssl: 'require',
    });
    console.log('Attempting to connect to Supabase...');
    console.log('Wiping the public schema...');
    await sql`DROP SCHEMA IF EXISTS public CASCADE`;
    await sql`CREATE SCHEMA public`;
    await sql`GRANT ALL ON SCHEMA public TO postgres`;
    await sql`GRANT ALL ON SCHEMA public TO anon`;
    await sql`GRANT ALL ON SCHEMA public TO authenticated`;
    await sql`GRANT ALL ON SCHEMA public TO service_role`;
    console.log('Public schema wiped and recreated successfully.');

    await sql.end();
  } catch (error) {
    console.error('Failed to connect to Supabase:', error.message);
  }
}

testConnection();
