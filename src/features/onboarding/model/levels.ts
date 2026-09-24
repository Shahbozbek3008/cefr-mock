import type { DailyMinutes, TargetLevel } from '@/entities/user/model';

export type LevelOption = {
  level: TargetLevel;
  title: string;
  description: string;
  range: string;
};

export const levelOptions: LevelOption[] = [
  {
    level: 'B1',
    title: 'Intermediate',
    description: 'Kundalik mavzularda erkin muloqot',
    range: '38–50',
  },
  {
    level: 'B2',
    title: 'Upper-Intermediate',
    description: 'Universitet va ish uchun yetarli',
    range: '51–64',
  },
  {
    level: 'C1',
    title: 'Advanced',
    description: 'Akademik va professional daraja',
    range: '65–75',
  },
];

export type PaceOption = {
  minutes: DailyMinutes;
  title: string;
  recommended: boolean;
};

export const paceOptions: PaceOption[] = [
  { minutes: 15, title: 'Yengil', recommended: false },
  { minutes: 30, title: 'Tavsiya', recommended: true },
  { minutes: 45, title: 'Jiddiy', recommended: false },
  { minutes: 60, title: 'Intensiv', recommended: false },
];
