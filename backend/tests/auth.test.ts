import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { app } from '../src/app';
import { createUserAndLogin, resetDatabase } from './helpers';

beforeEach(resetDatabase);

const validUser = {
  email: 'ana@correo.com',
  password: 'clave12345',
  displayName: 'Ana',
};

describe('POST /api/auth/register', () => {
  it('crea el usuario y no expone la contraseña', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('ana@correo.com');
    expect(JSON.stringify(res.body)).not.toContain('password');
  });

  it('rechaza un correo ya registrado', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(409);
  });

  it('rechaza una contraseña demasiado corta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...validUser, password: '123' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('devuelve un token con credenciales correctas', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
  });

  it('rechaza una contraseña incorrecta', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'otra_clave_mala' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('rechaza la petición sin token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('devuelve el usuario con un token válido', async () => {
    const token = await createUserAndLogin();
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('ana@correo.com');
  });
});