import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { getProgress, getToday, markDone } from './check-ins.controller';

export const checkInsRouter = Router();

checkInsRouter.get('/habits/today', requireAuth, getToday);
checkInsRouter.post('/habits/:habitId/check-ins', requireAuth, markDone);
checkInsRouter.get('/habits/:habitId/check-ins', requireAuth, getProgress);