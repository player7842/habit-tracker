import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchToday, markHabitDone } from '../../api/habits';
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