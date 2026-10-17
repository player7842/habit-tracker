import { useState } from 'react';
import { CheckButton } from './components/CheckButton/CheckButton';
import { AuthProvider } from './features/auth/AuthProvider';
import { useAuth } from './features/auth/useAuth';
import { LoginPage } from './pages/LoginPage';
import './App.css';

function Content() {
  const { user, isLoading, signOut } = useAuth();
  const [done, setDone] = useState(false);

  if (isLoading) {
    return (
      <main className="demo">
        <p className="demo-status">Cargando…</p>
      </main>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <main className="demo">
      <h1>Hola, {user.displayName}</h1>

      <div className={`demo-card ${done ? 'demo-card--done' : ''}`}>
        <div>
          <p className="demo-title">Tender la cama</p>
          <p className={`demo-status ${done ? 'demo-status--done' : ''}`}>
            {done ? '¡Cumplido hoy!' : 'Hasta las 10:00 a. m.'}
          </p>
        </div>

        <CheckButton
          label="Marcar «Tender la cama» como cumplido"
          checked={done}
          onCheck={() => setDone(true)}
        />
      </div>

      <button className="demo-reset" onClick={signOut}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Content />
    </AuthProvider>
  );
}