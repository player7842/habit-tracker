import type { Request, Response } from 'express';
import { parseOrThrow } from '../../utils/validate';
import { habitIdSchema } from './check-ins.schemas';
import {
  getHabitProgress,
  getTodayOverview,
  markHabitDone,
} from './check-ins.service';

export async function markDone(req: Request, res: Response) {
  const habitId = parseOrThrow(habitIdSchema, req.params.habitId);
  const checkIn = await markHabitDone(habitId, res.locals.userId);
  res.status(201).json({ checkIn });
}

export async function getProgress(req: Request, res: Response) {
  const habitId = parseOrThrow(habitIdSchema, req.params.habitId);
  const progress = await getHabitProgress(habitId, res.locals.userId);
  res.json(progress);
}

export async function getToday(_req: Request, res: Response) {
  const overview = await getTodayOverview(res.locals.userId);
  res.json(overview);
}