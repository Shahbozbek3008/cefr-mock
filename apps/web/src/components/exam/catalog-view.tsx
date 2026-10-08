'use client';

import { useId, useMemo, useState } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import { ArrowRight, Lock, Search } from 'lucide-react';
import {
  MAX_SCORE,
  applyCatalog,
  catalogModes,
  fetchPracticeTest,
  filterOrder,
  practiceItems,
  sectionTitles,
  useCefrClient,
  useTests,
  type CatalogFilter,
  type CatalogMode,
  type CatalogSort,
  type PracticeItem,
  type TestSummary,
} from '@cefr/core';
import { Link, useRouter } from '@/i18n/navigation';
import { ROUTES, SKILL_ICONS } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { failureKey } from '@/lib/exam/session';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Tag } from '@/components/ui/tag';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ActivePill } from '@/components/motion/active-pill';
import { panelSurface } from '@/components/dashboard/panel';

const hrefOf = (test: TestSummary) => {
  if (test.status === 'locked') return ROUTES.billing;
  if (test.status === 'completed' && test.resultId) return ROUTES.result(test.resultId);
  if (test.status === 'in_progress') return ROUTES.testSection(test.id, test.resumeSection ?? 'listening');
  return ROUTES.test(test.id);
};

function TestCard({ test }: { test: TestSummary }) {
  const t = useTranslations('exam');
  const format = useFormatter();
  const period = format.dateTime(new Date(test.format.year, test.format.month, 1), { month: 'long', year: 'numeric' });

  return (
    <Link
      href={hrefOf(test)}
      className={cn(panelSurface, 'group flex min-h-[188px] flex-col gap-4 p-5 text-ink transition-[box-shadow,translate] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5 hover:text-ink hover:shadow-e1')}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {test.isNew && test.status === 'new' && <Tag size="sm">{t('catalog.newBadge')}</Tag>}
          {test.isFree && <Tag tone="neutral" size="sm">{t('catalog.freeBadge')}</Tag>}
          {test.status === 'locked' && <Tag tone="pro" size="sm"><Icon as={Lock} size={10} strokeWidth={2.2} />Pro</Tag>}
        </div>
        <span className="font-mono text-xs text-ink-3">{test.durationLabel}</span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[17px] font-medium tracking-[-0.02em]">{test.title}</span>
        <span className="text-[13px] text-ink-2">
          {test.status === 'in_progress' && test.resumeSection
            ? t('catalog.inProgress', { section: sectionTitles[test.resumeSection] })
            : test.status === 'completed' && test.completedAt
              ? t('catalog.completedOn', { date: format.dateTime(new Date(test.completedAt), { day: 'numeric', month: 'long' }) })
              : test.status === 'locked'
                ? t('catalog.premium', { period })
                : t('catalog.formatOf', { period })}
        </span>
      </div>
      <div className="mt-auto">
        {test.status === 'in_progress' ? (
          <div className="flex flex-col gap-2">
            <ProgressBar value={Math.round((test.progress ?? 0) * 100)} />
            <div className="flex justify-between text-[13px]">
              <span className="font-mono text-ink-2">{test.resumeAnswered}/{test.resumeTotal}</span>
              <span className="flex items-center gap-1 font-medium text-green-text">{t('catalog.resumeShort')}<Icon as={ArrowRight} size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
            </div>
          </div>
        ) : test.status === 'completed' ? (
          <span className="flex items-center gap-2 font-mono text-[15px]">
            {test.score}<span className="text-ink-3">/{MAX_SCORE}</span>
            {test.level && <Tag size="sm">{test.level}</Tag>}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[13px] font-medium text-green-text">
            {t(test.status === 'locked' ? 'common.continue' : 'common.start')}
            <Icon as={ArrowRight} size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}

function PracticeList() {
  const t = useTranslations('exam');
  const client = useCefrClient();
  const router = useRouter();
  const [opening, setOpening] = useState<PracticeItem['kind'] | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const open = async (item: PracticeItem) => {
    setOpening(item.kind);
    setFailure(null);
    try {
      const testId = await fetchPracticeTest(client, item.kind);
      if (!testId) throw new Error('practice_unavailable');
      router.push(`${ROUTES.testSection(testId, item.kind)}?scope=${item.kind}`);
    } catch (error) {
      setFailure(`${t('session.startFailed')} ${t(`common.${failureKey(error)}`)}`);
      setOpening(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {failure && <span className="text-[13px] text-error-text">{failure}</span>}
      <div className="stagger grid gap-3 md:grid-cols-2">
        {practiceItems.map((item) => (
          <button
            key={item.kind}
            type="button"
            disabled={opening !== null}
            onClick={() => open(item)}
            className={cn(panelSurface, 'group flex items-center gap-4 p-5 text-left text-ink transition-[box-shadow,translate,opacity] duration-(--t-sheet) ease-out-expo hover:-translate-y-0.5 hover:shadow-e1 disabled:pointer-events-none', opening !== null && opening !== item.kind && 'opacity-60')}
          >
            <span className="grid size-11 place-items-center rounded-[12px] bg-surface-sunken text-ink-body"><Icon as={SKILL_ICONS[item.kind]} size={19} strokeWidth={1.6} /></span>
            <span className="flex flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-medium">{t('catalog.practiceTitle', { section: sectionTitles[item.kind] })}</span>
              <span className="text-[13px] text-ink-2">{t(`sections.${item.kind}Detail`, { parts: item.parts, questions: item.questions ?? 0 })}</span>
            </span>
            {opening === item.kind ? (
              <Spinner size={16} className="text-ink-2" />
            ) : (
              <span className="font-mono text-[13px] text-ink-2">{t(item.approx ? 'units.minutesApprox' : 'units.minutes', { count: item.minutes })}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CatalogView() {
  const t = useTranslations('exam');
  const tests = useTests();
  const modeLayout = useId();
  const filterLayout = useId();
  const [mode, setMode] = useState<CatalogMode>('full');
  const [filter, setFilter] = useState<CatalogFilter>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<CatalogSort>('newest');
  const list = useMemo(() => applyCatalog(tests.data ?? [], filter, query, sort), [tests.data, filter, query, sort]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          {tests.data && <span className="text-[13px] text-ink-2">{t('units.tests', { count: tests.data.length })}</span>}
          <h1 className="m-0 text-[30px] leading-[1.1] font-medium tracking-[-0.04em]">{t('catalog.title')}</h1>
        </div>
        <label className="flex h-10 w-full max-w-[320px] items-center gap-2.5 rounded-[12px] bg-surface px-3.5 text-sm shadow-inset focus-within:shadow-focus">
          <Icon as={Search} size={15} strokeWidth={1.75} className="text-ink-3" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('catalog.search')} aria-label={t('catalog.search')} className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-3" />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="flex h-10 rounded-[12px] bg-seg-track p-1 text-[13px]">
          {catalogModes.map((value) => (
            <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => setMode(value)} className={cn('relative isolate flex items-center rounded-[9px] px-4 transition-colors', mode === value ? 'font-medium text-ink' : 'text-ink-2 hover:text-ink')}>
              {mode === value && <ActivePill layoutId={modeLayout} className="rounded-[9px] bg-surface shadow-[0_1px_2px_rgba(20,22,30,.08)]" />}
              {t(value === 'full' ? 'catalog.fullMock' : 'catalog.sectionPractice')}
            </button>
          ))}
        </div>
        {mode === 'full' && (
          <div className="flex flex-wrap items-center gap-1.5">
            {filterOrder.map((value) => (
              <Chip key={value} active={filter === value} layoutId={filterLayout} onClick={() => setFilter(value)}>{t(`catalog.filters.${value}`)}</Chip>
            ))}
            <button type="button" onClick={() => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'))} className="h-[34px] rounded-pill px-3 text-[13px] text-ink-2 hover:bg-hover hover:text-ink">
              {t(sort === 'newest' ? 'catalog.newestFirst' : 'catalog.oldestFirst')}
            </button>
          </div>
        )}
      </div>

      {mode === 'sections' ? (
        <PracticeList />
      ) : tests.isError ? (
        <div className={cn(panelSurface, 'flex flex-col items-center gap-3 p-10 text-center')}>
          <span className="text-sm text-ink-2">{t(`common.${failureKey(tests.error)}`)}</span>
          <Button size="md" onClick={() => tests.refetch()}>{t('common.retry')}</Button>
        </div>
      ) : !tests.data ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <div key={i} className={cn(panelSurface, 'h-[188px] animate-pulse')} />)}
        </div>
      ) : list.length === 0 ? (
        <div className={cn(panelSurface, 'flex flex-col items-center gap-1 p-10 text-center')}>
          <span className="text-[15px] font-medium">{t('catalog.emptyTitle')}</span>
          <span className="text-[13px] text-ink-2">{t('catalog.emptyMessage')}</span>
        </div>
      ) : (
        <div className="stagger grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((test) => <TestCard key={test.id} test={test} />)}
        </div>
      )}
    </div>
  );
}
