import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../errors/app-error';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError(401, 'Debes iniciar sesión');
  }

  const token = header.slice('Bearer '.length);

  let userId: string;
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (typeof payload === 'string' || !payload.sub) {
      throw new Error('Token sin usuario');
    }
    userId = payload.sub;
  } catch {
    throw new AppError(401, 'Sesión inválida o expirada');
  }

  res.locals.userId = userId;
  next();
}