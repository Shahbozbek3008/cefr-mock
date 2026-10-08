import type { TagTone } from '@/components/ui/tag';

export type CatalogStatus = 'new' | 'inProgress' | 'done' | 'free' | 'pro';

export const STATUS_TONE: Record<CatalogStatus, TagTone> = {
  new: 'green',
  inProgress: 'blue',
  done: 'neutral',
  free: 'neutral',
  pro: 'pro',
};

export type CatalogTest = {
  id: string;
  name: string;
  status: CatalogStatus;
  duration: string;
  meta: { key: 'sections' | 'sectionsMonth' | 'progress' | 'date'; values?: Record<string, string | number> };
  progress?: number;
  score?: number;
  level?: string;
};

export const CATALOG: readonly CatalogTest[] = [
  { id: '13', name: 'Mock Test #13', status: 'new', duration: '2:50', meta: { key: 'sectionsMonth' } },
  { id: '12', name: 'Mock Test #12', status: 'inProgress', duration: '2:50', meta: { key: 'progress', values: { section: 'Reading', part: 3 } }, progress: 62 },
  { id: '11', name: 'Mock Test #11', status: 'done', duration: '2:50', meta: { key: 'date' }, score: 58, level: 'B2' },
  { id: '10', name: 'Mock Test #10', status: 'free', duration: '2:50', meta: { key: 'sections' } },
  { id: '9', name: 'Mock Test #9', status: 'pro', duration: '2:50', meta: { key: 'sections' } },
  { id: '8', name: 'Mock Test #8', status: 'pro', duration: '2:50', meta: { key: 'sections' } },
];

export const CATALOG_FILTERS = ['all', 'new', 'notStarted', 'done', 'free'] as const;

export const RECOMMENDED = [
  { id: 'mock13', kind: 'full', name: 'Mock Test #13', duration: '2:45', tag: 'new', tone: 'green', result: '—' },
  { id: 'writing2', kind: 'drill', name: 'Writing Task 2 · Opinion', duration: '40', tag: 'weak', tone: 'warning', result: '—' },
  { id: 'mock11', kind: 'done', name: 'Mock Test #11', duration: '2:45', tag: 'done', tone: 'neutral', result: '45/75' },
] as const;

export const IN_PROGRESS = { id: '12', name: 'Mock Test #12', section: 'Reading', part: 3, answered: 22, total: 35, left: '38:20', progress: 62 } as const;

export const TEST_OVERVIEW = {
  id: '13',
  name: 'Mock Test #13',
  totalTime: '2:50',
  sections: [
    { skill: 'listening', parts: 6, questions: 35, minutes: '35' },
    { skill: 'reading', parts: 5, questions: 35, minutes: '60' },
    { skill: 'writing', tasks: 2, minutes: '60' },
    { skill: 'speaking', parts: 3, minutes: '~15' },
  ],
} as const;
