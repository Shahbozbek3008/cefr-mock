const weekdays = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

const months = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
];

const pad = (value: number) => String(value).padStart(2, '0');

const parse = (value: Date | string) => (typeof value === 'string' ? new Date(`${value}T00:00:00`) : value);

export const formatDayMonth = (value: Date | string) => {
  const date = parse(value);
  return `${date.getDate()}-${months[date.getMonth()]}`;
};

export const formatLongDate = (value: Date | string) => {
  const date = parse(value);
  return `${weekdays[date.getDay()]}, ${formatDayMonth(date)}`;
};

export const formatShortDate = (value: Date | string) => {
  const date = parse(value);
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}`;
};

export const daysUntil = (iso: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((parse(iso).getTime() - today.getTime()) / 86_400_000));
};
