import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { fetchCurrentUser, login } from '../../api/auth';
import type { User } from '../../api/auth';
import { AuthContext } from './auth-context';

const TOKEN_KEY = 'habit-tracker-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(
    () => localStorage.getItem(TOKEN_KEY) !== null,
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) return;

    fetchCurrentUser(storedToken)
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, password: string) {
    const result = await login(email, password);
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}