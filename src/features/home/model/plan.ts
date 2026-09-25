import type { SectionKind } from '@/entities/test';

export type PlanItem = {
  id: string;
  section: SectionKind;
  part: string;
  minutes: number;
  done: boolean;
  correct?: number;
  total?: number;
};

export const todayPlan: PlanItem[] = [
  { id: 'p1', section: 'listening', part: 'Part 3', minutes: 12, done: true, correct: 8, total: 10 },
  { id: 'p2', section: 'writing', part: 'Task 1', minutes: 15, done: false },
];
