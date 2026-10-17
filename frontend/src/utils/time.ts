export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);

  return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatLongDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}