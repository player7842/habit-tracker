import { z } from 'zod';

export const habitIdSchema = z.string().regex(/^\d+$/, 'habitId inválido');