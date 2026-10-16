import type { Request, Response } from 'express';
import { parseOrThrow } from '../../utils/validate';
import { loginSchema, registerSchema } from './auth.schemas';
import { loginUser, registerUser } from './auth.service';

export async function register(req: Request, res: Response) {
  const input = parseOrThrow(registerSchema, req.body);
  const user = await registerUser(input);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const input = parseOrThrow(loginSchema, req.body);
  const result = await loginUser(input);
  res.json(result);
}