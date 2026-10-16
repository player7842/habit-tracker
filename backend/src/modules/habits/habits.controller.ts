import type { Request, Response } from 'express';
import { parseOrThrow } from '../../utils/validate';
import { createHabitSchema } from './habits.schemas';
import { addHabit, getTemplates, getUserHabits } from './habits.service';

export async function listTemplatesHandler(_req: Request, res: Response) {
  const templates = await getTemplates();
  res.json({ templates });
}

export async function listMyHabits(_req: Request, res: Response) {
  const habits = await getUserHabits(res.locals.userId);
  res.json({ habits });
}

export async function createMyHabit(req: Request, res: Response) {
  const input = parseOrThrow(createHabitSchema, req.body);
  const habit = await addHabit(res.locals.userId, input);
  res.status(201).json({ habit });
}