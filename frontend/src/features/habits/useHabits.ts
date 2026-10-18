import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createHabit,
  fetchTemplates,
  fetchToday,
  markHabitDone,
} from '../../api/habits';
import type { NewHabitInput } from '../../api/habits';
import { useAuth } from '../auth/useAuth';

export function useTodayQuery() {
  const { user, token } = useAuth();

  return useQuery({
    queryKey: ['habits', 'today', user?.id],
    queryFn: () => {
      if (!token) throw new Error('Sin sesión');
      return fetchToday(token);
    },
    enabled: token !== null,
  });
}

export function useTemplatesQuery() {
  const { token } = useAuth();

  return useQuery({
    queryKey: ['habits', 'templates'],
    queryFn: () => {
      if (!token) throw new Error('Sin sesión');
      return fetchTemplates(token);
    },
    enabled: token !== null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCheckInMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (habitId: string) => {
      if (!token) throw new Error('Sin sesión');
      return markHabitDone(token, habitId);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['habits', 'today'] }),
  });
}

export function useCreateHabitMutation() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewHabitInput) => {
      if (!token) throw new Error('Sin sesión');
      return createHabit(token, input);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['habits', 'today'] }),
  });
}