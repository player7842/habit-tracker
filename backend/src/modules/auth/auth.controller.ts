import type { Request, Response } from 'express';
import { AppError } from '../../errors/app-error';
import { registerSchema } from './auth.schemas';
import { registerUser } from './auth.service';

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('. ');
    throw new AppError(400, message);
  }

  const user = await registerUser(parsed.data);
  res.status(201).json({ user });
}