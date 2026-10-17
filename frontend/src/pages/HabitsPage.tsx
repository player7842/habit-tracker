import { useState } from 'react';
import { CheckButton } from '../components/CheckButton/CheckButton';
import { useAuth } from '../features/auth/useAuth';
import '../App.css';

export function HabitsPage() {
  const { user, signOut } = useAuth();
  const [done, setDone] = useState(false);

  return (
    <main className="demo">
      <h1>Hola, {user?.displayName}</h1>

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