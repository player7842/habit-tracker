import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { ApiError } from '../api/client';
import { AuthForm } from '../components/AuthForm/AuthForm';
import { Field } from '../components/Field/Field';
import { useAuth } from '../features/auth/useAuth';

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Algo salió mal. Intenta de nuevo.',
      );
      setIsSubmitting(false);
    }
  }

  return (
    <AuthForm
      title="¡Qué bueno verte!"
      subtitle="Inicia sesión y sigue con tu racha"
      submitLabel="Entrar"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
      footer={
        <>
          ¿Aún no tienes cuenta? <Link to="/register">Crea una</Link>
        </>
      }
    >
      <Field
        label="Correo"
        type="email"
        placeholder="tucorreo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <Field
        label="Contraseña"
        type="password"
        placeholder="Tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
    </AuthForm>
  );
}