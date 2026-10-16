import { pool } from '../../db/pool';

export interface HabitContextRow {
  id: string;
  local_date: string;
  past_deadline: boolean;
}

export interface CheckInRow {
  id: string;
  habit_id: string;
  check_date: string;
  status: string;
}

export async function findHabitContext(
  habitId: string,
  userId: string,
): Promise<HabitContextRow | undefined> {
  const result = await pool.query<HabitContextRow>(
    `SELECT h.id,
            (now() AT TIME ZONE u.timezone)::date::text AS local_date,
            (h.deadline_time IS NOT NULL
              AND (now() AT TIME ZONE u.timezone)::time > h.deadline_time
            ) AS past_deadline
     FROM habits h
     JOIN users u ON u.id = h.user_id
     WHERE h.id = $1 AND h.user_id = $2 AND h.is_active = TRUE`,
    [habitId, userId],
  );
  return result.rows[0];
}

export async function insertCheckIn(
  habitId: string,
  checkDate: string,
): Promise<CheckInRow> {
  const result = await pool.query<CheckInRow>(
    `INSERT INTO check_ins (habit_id, check_date, status)
     VALUES ($1, $2, 'done')
     RETURNING id, habit_id, check_date::text AS check_date, status`,
    [habitId, checkDate],
  );
  return result.rows[0];
}

export async function listDoneDates(habitId: string): Promise<string[]> {
  const result = await pool.query<{ check_date: string }>(
    `SELECT check_date::text AS check_date
     FROM check_ins
     WHERE habit_id = $1 AND status = 'done'
     ORDER BY check_date DESC`,
    [habitId],
  );
  return result.rows.map((row) => row.check_date);
}