import { apiRequest } from './client';

export interface TodayHabit {
  id: string;
  name: string;
  deadlineTime: string | null;
  doneToday: boolean;
  canCheckIn: boolean;
  currentStreak: number;
}

export interface TodayOverview {
  today: string;
  habits: TodayHabit[];
}

export function fetchToday(token: string) {
  return apiRequest<TodayOverview>('/habits/today', { token });
}

export function markHabitDone(token: string, habitId: string) {
  return apiRequest<{ checkIn: { id: string; date: string } }>(
    `/habits/${habitId}/check-ins`,
    { method: 'POST', token },
  );
}