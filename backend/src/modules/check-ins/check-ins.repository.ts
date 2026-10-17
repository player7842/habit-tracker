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

export interface TodayHabitRow {
  id: string;
  name: string;
  deadline_time: string | null;
  past_deadline: boolean;
  goal_days: number | null;
}

export async function getLocalDate(userId: string): Promise<string | undefined> {
  const result = await pool.query<{ local_date: string }>(
    `SELECT (now() AT TIME ZONE timezone)::date::text AS local_date
     FROM users
     WHERE id = $1`,
    [userId],
  );
  return result.rows[0]?.local_date;
}

export async function listHabitsForToday(
  userId: string,
): Promise<TodayHabitRow[]> {
  const result = await pool.query<TodayHabitRow>(
    `SELECT h.id,
            h.name,
            h.deadline_time,
            h.goal_days,
            (h.deadline_time IS NOT NULL
              AND (now() AT TIME ZONE u.timezone)::time > h.deadline_time
            ) AS past_deadline
     FROM habits h
     JOIN users u ON u.id = h.user_id
     WHERE h.user_id = $1 AND h.is_active = TRUE
     ORDER BY h.created_at`,
    [userId],
  );
  return result.rows;
}

export async function listDoneDatesByHabit(
  userId: string,
): Promise<Map<string, string[]>> {
  const result = await pool.query<{ habit_id: string; check_date: string }>(
    `SELECT c.habit_id, c.check_date::text AS check_date
     FROM check_ins c
     JOIN habits h ON h.id = c.habit_id
     WHERE h.user_id = $1 AND h.is_active = TRUE AND c.status = 'done'
     ORDER BY c.check_date DESC`,
    [userId],
  );

  const byHabit = new Map<string, string[]>();
  for (const row of result.rows) {
    const dates = byHabit.get(row.habit_id) ?? [];
    dates.push(row.check_date);
    byHabit.set(row.habit_id, dates);
  }
  return byHabit;
}