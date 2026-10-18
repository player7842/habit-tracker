import { apiRequest } from './client';

export interface TodayHabit {
  id: string;
  name: string;
  deadlineTime: string | null;
  goalDays: number | null;
  doneToday: boolean;
  canCheckIn: boolean;
  currentStreak: number;
}

export interface TodayOverview {
  today: string;
  habits: TodayHabit[];
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
}

export interface NewHabitInput {
  templateId?: string;
  name?: string;
  deadlineTime?: string;
  goalDays?: number;
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

export function fetchTemplates(token: string) {
  return apiRequest<{ templates: HabitTemplate[] }>('/habits/templates', {
    token,
  });
}

export function createHabit(token: string, input: NewHabitInput) {
  return apiRequest<{ habit: { id: string; name: string } }>('/habits', {
    method: 'POST',
    token,
    body: input,
  });
}