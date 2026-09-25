import type { SectionKind } from '@/entities/test';

export type PlanItem = {
  id: string;
  title: string;
  meta: string;
  minutes: number;
  done: boolean;
  section: SectionKind;
};

export const todayPlan: PlanItem[] = [
  {
    id: 'p1',
    title: 'Listening · Part 3',
    meta: "12 daq · 8/10 to'g'ri",
    minutes: 12,
    done: true,
    section: 'listening',
  },
  { id: 'p2', title: 'Writing · Task 1', meta: '15 daq · AI baholaydi', minutes: 15, done: false, section: 'writing' },
];
