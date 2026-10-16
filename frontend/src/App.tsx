import { useState } from 'react';
import { CheckButton } from './components/CheckButton/CheckButton';
import './App.css';

export default function App() {
  const [done, setDone] = useState(false);

  return (
    <main className="demo">
      <h1>Habit Tracker</h1>

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

      {done && (
        <button className="demo-reset" onClick={() => setDone(false)}>
          Reiniciar demo
        </button>
      )}
    </main>
  );
}