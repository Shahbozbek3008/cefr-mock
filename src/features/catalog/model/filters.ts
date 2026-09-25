import type { SectionKind, TestSummary } from '@/entities/test';

export type CatalogMode = 'full' | 'sections';
export type CatalogFilter = 'all' | 'free' | 'new' | 'completed';
export type CatalogSort = 'newest' | 'oldest';

export const modeOptions = [
  { value: 'full', label: "To'liq mock" },
  { value: 'sections', label: "Bo'lim mashqlari" },
] as const;

export const filterLabels: Record<CatalogFilter, string> = {
  all: 'Barchasi',
  free: 'Bepul',
  new: 'Boshlanmagan',
  completed: 'Tugatilgan',
};

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
  const list = tests.filter(
    (t) => predicates[filter](t) && (q === '' || `${t.title} ${t.subtitle}`.toLowerCase().includes(q)),
  );
  const byNumber = [...list].sort((x, y) => y.number - x.number);
  return sort === 'newest' ? byNumber.sort((x, y) => statusRank[x.status] - statusRank[y.status]) : byNumber.reverse();
};

export type PracticeItem = {
  kind: SectionKind;
  title: string;
  detail: string;
  minutes: string;
};

export const practiceItems: PracticeItem[] = [
  { kind: 'listening', title: 'Listening mashqlari', detail: '6 qism · 35 savol', minutes: '35 daq' },
  { kind: 'reading', title: 'Reading mashqlari', detail: '5 qism · 35 savol', minutes: '60 daq' },
  { kind: 'writing', title: 'Writing mashqlari', detail: '2 topshiriq · AI baho', minutes: '60 daq' },
  { kind: 'speaking', title: 'Speaking mashqlari', detail: '3 qism · AI baho', minutes: '~15 daq' },
];
