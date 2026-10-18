import { pool } from '../../db/pool';

export interface TemplateRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export interface HabitRow {
  id: string;
  template_id: string | null;
  name: string;
  deadline_time: string | null;
  goal_days: number | null;
  created_at: Date;
}

export async function listTemplates(): Promise<TemplateRow[]> {
  const result = await pool.query<TemplateRow>(
    `SELECT id, name, description, category
     FROM habit_templates
     ORDER BY category, name`,
  );
  return result.rows;
}

export async function findTemplateById(
  id: number,
): Promise<TemplateRow | undefined> {
  const result = await pool.query<TemplateRow>(
    `SELECT id, name, description, category
     FROM habit_templates
     WHERE id = $1`,
    [id],
  );
  return result.rows[0];
}

export async function createHabit(
  userId: string,
  templateId: string | null,
  name: string,
  deadlineTime: string | null,
  goalDays: number | null,
): Promise<HabitRow> {
  const result = await pool.query<HabitRow>(
    `INSERT INTO habits (user_id, template_id, name, deadline_time, goal_days)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, template_id, name, deadline_time, goal_days, created_at`,
    [userId, templateId, name, deadlineTime, goalDays],
  );
  return result.rows[0];
}

export async function listHabitsByUser(userId: string): Promise<HabitRow[]> {
  const result = await pool.query<HabitRow>(
    `SELECT id, template_id, name, deadline_time, goal_days, created_at
     FROM habits
     WHERE user_id = $1 AND is_active = TRUE
     ORDER BY created_at`,
    [userId],
  );
  return result.rows;
}