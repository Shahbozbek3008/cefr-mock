export type CalendarCell = {
  day: number | null;
  iso: string | null;
};

const pad = (value: number) => String(value).padStart(2, '0');

export const toIso = (year: number, month: number, day: number) => `${year}-${pad(month + 1)}-${pad(day)}`;

export const buildMonthGrid = (year: number, month: number): CalendarCell[] => {
  const firstDay = new Date(year, month, 1).getDay();
  const leading = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = Array.from({ length: leading }, () => ({
    day: null,
    iso: null,
  }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, iso: toIso(year, month, day) });
  }

  return cells;
};

export const isOfficialExamDay = (iso: string) => {
  const day = Number(iso.slice(8, 10));
  return day % 8 === 1;
};
