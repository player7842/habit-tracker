import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../errors/app-error';
import { createUser, findUserByEmail, findUserById } from './auth.repository';
import type { LoginInput, RegisterInput } from './auth.schemas';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRATION = '7d';

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

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email.toLowerCase());

  const passwordMatches = user
    ? await bcrypt.compare(input.password, user.password_hash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError(401, 'Correo o contraseña incorrectos');
  }

  const token = jwt.sign({ sub: user.id }, env.jwtSecret, {
    expiresIn: TOKEN_EXPIRATION,
  });

  return {
    token,
    user: { id: user.id, email: user.email, displayName: user.display_name },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(401, 'Sesión inválida o expirada');
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    createdAt: user.created_at,
  };
}