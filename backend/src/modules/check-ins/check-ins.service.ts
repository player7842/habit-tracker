import { AppError } from '../../errors/app-error';
import {
  findHabitContext,
  getLocalDate,
  insertCheckIn,
  listDoneDates,
  listDoneDatesByHabit,
  listHabitsForToday,
} from './check-ins.repository';

function previousDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function calculateCurrentStreak(doneDates: string[], today: string): number {
  const done = new Set(doneDates);
  let cursor = done.has(today) ? today : previousDay(today);
  let streak = 0;

  while (done.has(cursor)) {
    streak++;
    cursor = previousDay(cursor);
  }

  return streak;
}

export async function markHabitDone(habitId: string, userId: string) {
  const habit = await findHabitContext(habitId, userId);

  if (!habit) {
    throw new AppError(404, 'Hábito no encontrado');
  }

  if (habit.past_deadline) {
    throw new AppError(403, 'Ya pasó la hora límite de este hábito');
  }

  try {
    const checkIn = await insertCheckIn(habit.id, habit.local_date);
    return {
      id: checkIn.id,
      habitId: checkIn.habit_id,
      date: checkIn.check_date,
      status: checkIn.status,
    };
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw new AppError(409, 'Ya registraste este hábito hoy');
    }
    throw error;
  }
}

export async function getHabitProgress(habitId: string, userId: string) {
  const habit = await findHabitContext(habitId, userId);

  if (!habit) {
    throw new AppError(404, 'Hábito no encontrado');
  }

  const doneDates = await listDoneDates(habit.id);

  return {
    today: habit.local_date,
    doneDates,
    currentStreak: calculateCurrentStreak(doneDates, habit.local_date),
  };
}

export async function getTodayOverview(userId: string) {
  const [today, habits, doneByHabit] = await Promise.all([
    getLocalDate(userId),
    listHabitsForToday(userId),
    listDoneDatesByHabit(userId),
  ]);

  if (!today) {
    throw new AppError(401, 'Sesión inválida o expirada');
  }

  return {
    today,
    habits: habits.map((habit) => {
      const doneDates = doneByHabit.get(habit.id) ?? [];
      const doneToday = doneDates.includes(today);

      return {
        id: habit.id,
        name: habit.name,
        deadlineTime: habit.deadline_time
          ? habit.deadline_time.slice(0, 5)
          : null,
        doneToday,
        canCheckIn: !doneToday && !habit.past_deadline,
        currentStreak: calculateCurrentStreak(doneDates, today),
      };
    }),
  };
}