import mysql from 'mysql2/promise';
import 'dotenv/config';

async function testConnection() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Successfully connected to the database.');
    const [rows] = await connection.execute('SHOW TABLES;');
    console.log('Tables:', rows);
    await connection.end();
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
  }
}

testConnection();
