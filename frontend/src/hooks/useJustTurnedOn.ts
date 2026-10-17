import { useState } from 'react';

export function useJustTurnedOn(value: boolean): boolean {
  const [previous, setPrevious] = useState(value);
  const [justTurnedOn, setJustTurnedOn] = useState(false);

  if (value !== previous) {
    setPrevious(value);
    setJustTurnedOn(value);
  }

  return justTurnedOn;
}