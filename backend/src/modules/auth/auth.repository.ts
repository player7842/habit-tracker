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

export interface UserWithPasswordRow extends UserRow {
  password_hash: string;
}

export async function findUserByEmail(
  email: string,
): Promise<UserWithPasswordRow | undefined> {
  const result = await pool.query<UserWithPasswordRow>(
    `SELECT id, email, display_name, created_at, password_hash
     FROM users
     WHERE email = $1`,
    [email],
  );
  return result.rows[0];
}