import type { ZodType } from 'zod';
import { AppError } from '../errors/app-error';

export function parseOrThrow<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('. ');
    throw new AppError(400, message);
  }

  return result.data;
}