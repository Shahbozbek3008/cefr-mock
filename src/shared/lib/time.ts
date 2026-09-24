const pad = (value: number) => String(value).padStart(2, '0');

export const formatClock = (totalSeconds: number) => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const formatHours = (totalSeconds: number) => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
};

export const secondsUntil = (timestamp: number) => Math.max(0, Math.ceil((timestamp - Date.now()) / 1000));
