import request from 'supertest';
import { app } from '../src/app';
import { pool } from '../src/db/pool';

export async function resetDatabase() {
  await pool.query('DELETE FROM users');
}

export async function createUserAndLogin(email = 'ana@correo.com') {
  const password = 'clave12345';

  await request(app)
    .post('/api/auth/register')
    .send({ email, password, displayName: 'Ana' });

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return login.body.token as string;
}

export async function createHabit(token: string, body: object) {
  const res = await request(app)
    .post('/api/habits')
    .set('Authorization', `Bearer ${token}`)
    .send(body);

  return res.body.habit.id as string;
}