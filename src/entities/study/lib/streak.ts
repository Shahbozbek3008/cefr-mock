const DAY_MS = 86_400_000;
const WEEK_LENGTH = 7;

const pad = (value: number) => String(value).padStart(2, '0');

export const dayKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const shift = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);

export const weekdayIndex = (date: Date) => (date.getDay() + 6) % WEEK_LENGTH;

export const weekDays = (today: Date) => {
  const monday = shift(startOfDay(today), -weekdayIndex(today));
  return Array.from({ length: WEEK_LENGTH }, (_, index) => dayKey(shift(monday, index)));
};

export const streakOf = (minutesByDay: Record<string, number>, today: Date) => {
  const studied = (date: Date) => (minutesByDay[dayKey(date)] ?? 0) > 0;
  const anchor = startOfDay(today);
  let cursor = studied(anchor) ? anchor : shift(anchor, -1);
  let count = 0;
  while (studied(cursor)) {
    count += 1;
    cursor = shift(cursor, -1);
  }
  return count;
};
