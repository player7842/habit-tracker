import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import {
  archiveMyHabit,
  createMyHabit,
  listMyHabits,
  listTemplatesHandler,
} from './habits.controller';

export const habitsRouter = Router();

habitsRouter.use(requireAuth);

habitsRouter.get('/templates', listTemplatesHandler);
habitsRouter.get('/', listMyHabits);
habitsRouter.post('/', createMyHabit);
habitsRouter.delete('/:habitId', archiveMyHabit);