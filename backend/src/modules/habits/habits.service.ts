import { AppError } from '../../errors/app-error';
import {
  createHabit,
  findTemplateById,
  listHabitsByUser,
  listTemplates,
} from './habits.repository';
import type { HabitRow, TemplateRow } from './habits.repository';
import type { CreateHabitInput } from './habits.schemas';

function toHabitResponse(habit: HabitRow) {
  return {
    id: habit.id,
    templateId: habit.template_id,
    name: habit.name,
    deadlineTime: habit.deadline_time ? habit.deadline_time.slice(0, 5) : null,
    goalDays: habit.goal_days,
    createdAt: habit.created_at,
  };
}

export function getTemplates() {
  return listTemplates();
}

export async function getUserHabits(userId: string) {
  const habits = await listHabitsByUser(userId);
  return habits.map(toHabitResponse);
}

export async function addHabit(userId: string, input: CreateHabitInput) {
  let template: TemplateRow | undefined;

  if (input.templateId !== undefined) {
    template = await findTemplateById(input.templateId);
    if (!template) {
      throw new AppError(404, 'La plantilla no existe');
    }
  }

  const name = input.name ?? template?.name;
  if (!name) {
    throw new AppError(400, 'El hábito necesita un nombre');
  }

  const habit = await createHabit(
    userId,
    template?.id ?? null,
    name,
    input.deadlineTime ?? null,
    input.goalDays ?? null,
  );

  return toHabitResponse(habit);
}