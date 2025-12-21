import pool from './db';

async function migrate() {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS students (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                "group" TEXT NOT NULL
            );
        `);

    console.log('Migration completed');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

migrate();
