import type { SectionKind } from '../test/types';
import { sectionOrder } from '../test/sections';

export type SectionScores = Partial<Record<SectionKind, number>>;

const WEEK_PATTERN = [0, 1, 0, 2, 1, 3, 0];

export const weeklyPlan = (scores: SectionScores): SectionKind[] => {
  const ranked = [...sectionOrder].sort(
    (a, b) => (scores[a] ?? 0) - (scores[b] ?? 0) || sectionOrder.indexOf(a) - sectionOrder.indexOf(b),
  );
  return WEEK_PATTERN.map((rank) => ranked[rank]);
};

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
