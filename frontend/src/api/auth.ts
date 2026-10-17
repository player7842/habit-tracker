import { apiRequest } from './client';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function fetchCurrentUser(token: string) {
  return apiRequest<{ user: User }>('/auth/me', { token });
}

export function register(email: string, password: string, displayName: string) {
  return apiRequest<{ user: User }>('/auth/register', {
    method: 'POST',
    body: { email, password, displayName },
  });
}