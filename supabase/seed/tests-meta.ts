export type SeedTest = {
  id: string;
  number: number;
  formatMonth: number;
  formatYear: number;
  isNew: boolean;
  isPro: boolean;
};

export const seedTests: SeedTest[] = [
  { id: 't10', number: 10, formatMonth: 7, formatYear: 2026, isNew: false, isPro: false },
  { id: 't11', number: 11, formatMonth: 8, formatYear: 2026, isNew: false, isPro: false },
  { id: 't12', number: 12, formatMonth: 8, formatYear: 2026, isNew: false, isPro: false },
  { id: 't13', number: 13, formatMonth: 8, formatYear: 2026, isNew: true, isPro: false },
  { id: 't14', number: 14, formatMonth: 9, formatYear: 2026, isNew: false, isPro: true },
  { id: 't15', number: 15, formatMonth: 9, formatYear: 2026, isNew: true, isPro: true },
];

export const sectionMinutes = { listening: 35, reading: 60, writing: 60, speaking: 15 } as const;
