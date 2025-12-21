import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'students_db',
  password: 'postgres',
  port: 5433,
});

export default pool;
