import pg from 'pg'
const { Pool } = pg

const dbConfig = {
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
};

const pool = new Pool(dbConfig);

export async function connectToDatabase() {
  try {
    await pool.connect();
    console.log(`Connected to the database: ${dbConfig.database}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}