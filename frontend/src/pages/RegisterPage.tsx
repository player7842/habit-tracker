import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { register } from '../api/auth';
import { ApiError } from '../api/client';
import { AuthForm } from '../components/AuthForm/AuthForm';
import { Field } from '../components/Field/Field';
import { useAuth } from '../features/auth/useAuth';

export function RegisterPage() {
  const { signIn } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register(email, password, displayName);
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
      title="Crea tu cuenta"
      subtitle="Empieza tu primera racha hoy"
      submitLabel="Crear cuenta"
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
      footer={
        <>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </>
      }
    >
      <Field
        label="Nombre"
        placeholder="¿Cómo quieres que te llamemos?"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        autoComplete="name"
        minLength={2}
        maxLength={50}
        required
      />
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
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        required
      />
    </AuthForm>
  );
}