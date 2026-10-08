import type { SectionKind } from '@/entities/test';
import { sectionOrder } from '@/entities/test';

export type SectionScores = Partial<Record<SectionKind, number>>;

const WEEK_PATTERN = [0, 1, 0, 2, 1, 3, 0];

export const weeklyPlan = (scores: SectionScores): SectionKind[] => {
  const ranked = [...sectionOrder].sort(
    (a, b) => (scores[a] ?? 0) - (scores[b] ?? 0) || sectionOrder.indexOf(a) - sectionOrder.indexOf(b),
  );
  return WEEK_PATTERN.map((rank) => ranked[rank]);
};
