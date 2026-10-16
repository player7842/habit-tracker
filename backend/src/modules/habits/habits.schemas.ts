import { z } from 'zod';

export const createHabitSchema = z
  .object({
    templateId: z.coerce.number().int().positive().optional(),
    name: z.string().trim().min(2).max(80).optional(),
    deadlineTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Usa el formato HH:MM en 24 horas')
      .optional(),
  })
  .refine((data) => data.templateId !== undefined || data.name !== undefined, {
    message: 'Debes enviar templateId o name',
    path: ['name'],
  });

export type CreateHabitInput = z.infer<typeof createHabitSchema>;