import type { SectionKind } from '@/entities/test';

export type PlanItem = {
  id: string;
  section: SectionKind;
  minutes: number;
  done: boolean;
};

export const DEFAULT_DAILY_MINUTES = 30;

export const todayPlanOf = (section: SectionKind, goal: number, studiedMinutes: number): PlanItem[] => [
  { id: section, section, minutes: goal, done: studiedMinutes >= goal },
];
