import { pool } from '../../db/pool';

export interface UserRow {
  id: string;
  email: string;
  display_name: string;
  created_at: Date;
}

export async function createUser(
  email: string,
  passwordHash: string,
  displayName: string,
): Promise<UserRow> {
  const result = await pool.query<UserRow>(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, $3)
     RETURNING id, email, display_name, created_at`,
    [email, passwordHash, displayName],
  );
  return result.rows[0];
}