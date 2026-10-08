import type { DailyMinutes, TargetLevel } from '@/entities/user/model';
import type { TKey } from '@/shared/i18n';

export type LevelOption = {
  level: TargetLevel;
  title: string;
  range: string;
};

export const levelOptions: LevelOption[] = [
  {
    level: 'B1',
    title: 'Intermediate',
    range: '38–50',
  },
  {
    level: 'B2',
    title: 'Upper-Intermediate',
    range: '51–64',
  },
  {
    level: 'C1',
    title: 'Advanced',
    range: '65–75',
  },
];

export type PaceOption = {
  minutes: DailyMinutes;
  title: TKey;
  recommended: boolean;
};

export const paceOptions: PaceOption[] = [
  { minutes: 15, title: 'onboarding.pace.light', recommended: false },
  { minutes: 30, title: 'onboarding.pace.recommended', recommended: true },
  { minutes: 45, title: 'onboarding.pace.serious', recommended: false },
  { minutes: 60, title: 'onboarding.pace.intensive', recommended: false },
];
