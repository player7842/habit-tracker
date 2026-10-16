import bcrypt from 'bcryptjs';
import { AppError } from '../../errors/app-error';
import { createUser } from './auth.repository';
import type { RegisterInput } from './auth.schemas';

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  try {
    const user = await createUser(
      input.email.toLowerCase(),
      passwordHash,
      input.displayName,
    );
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
    };
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw new AppError(409, 'Ya existe una cuenta con ese correo');
    }
    throw error;
  }
}