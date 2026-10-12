export function formatSum(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function pct(value: number, max: number): string {
  return `${(value / max) * 100}%`;
}

export function signed(value: number): string {
  return value >= 0 ? `+${value}` : `−${Math.abs(value)}`;
}
