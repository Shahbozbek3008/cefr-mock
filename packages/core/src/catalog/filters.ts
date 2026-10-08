import type { SectionKind, TestSummary } from '../test/types';

export type CatalogMode = 'full' | 'sections';
export type CatalogFilter = 'all' | 'free' | 'new' | 'completed';
export type CatalogSort = 'newest' | 'oldest';

export const catalogModes: CatalogMode[] = ['full', 'sections'];

export const filterOrder: CatalogFilter[] = ['all', 'free', 'new', 'completed'];

const statusRank = { new: 0, in_progress: 1, completed: 2, locked: 3 } as const;

const predicates: Record<CatalogFilter, (t: TestSummary) => boolean> = {
  all: () => true,
  free: (t) => t.isFree,
  new: (t) => t.status === 'new',
  completed: (t) => t.status === 'completed',
};

export const applyCatalog = (tests: TestSummary[], filter: CatalogFilter, query: string, sort: CatalogSort) => {
  const q = query.trim().toLowerCase();
  const list = tests.filter((t) => predicates[filter](t) && (q === '' || t.title.toLowerCase().includes(q)));
  const byNumber = [...list].sort((x, y) => y.number - x.number);
  return sort === 'newest' ? byNumber.sort((x, y) => statusRank[x.status] - statusRank[y.status]) : byNumber.reverse();
};

export type PracticeItem = {
  kind: SectionKind;
  parts: number;
  questions?: number;
  minutes: number;
  approx?: boolean;
};

export const PRACTICE_TEST_ID = 't13';

export const practiceItems: PracticeItem[] = [
  { kind: 'listening', parts: 6, questions: 35, minutes: 35 },
  { kind: 'reading', parts: 5, questions: 35, minutes: 60 },
  { kind: 'writing', parts: 2, minutes: 60 },
  { kind: 'speaking', parts: 3, minutes: 15, approx: true },
];
