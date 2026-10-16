import dotenv from 'dotenv';
import { afterAll } from 'vitest';

dotenv.config({ path: '.env.test' });

if (!process.env.DATABASE_URL?.includes('_test')) {
  throw new Error(
    'Las pruebas solo pueden correr contra una base cuyo nombre contenga "_test"',
  );
}

afterAll(async () => {
  const { pool } = await import('../src/db/pool');
  await pool.end();
});