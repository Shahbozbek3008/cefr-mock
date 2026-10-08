import { useFormatter, useTranslations } from 'next-intl';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { sectionTitles, type TestSummary } from '@cefr/core';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { Tag, type TagTone } from '@/components/ui/tag';
import { Panel } from './panel';

const COLUMNS = 'grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_80px_24px]';

const TONE: Partial<Record<TestSummary['status'], TagTone>> = { in_progress: 'blue', new: 'green', completed: 'neutral' };

const hrefOf = (test: TestSummary) => {
  if (test.status === 'in_progress') return ROUTES.testSection(test.id, test.resumeSection ?? 'listening');
  if (test.status === 'completed' && test.resultId) return ROUTES.result(test.resultId);
  return ROUTES.test(test.id);
};

export function RecommendedTable({ tests }: { tests: readonly TestSummary[] }) {
  const t = useTranslations('dashboard.recommended');
  const tc = useTranslations('exam.catalog');
  const format = useFormatter();

  const detail = (test: TestSummary) => {
    if (test.status === 'in_progress') return tc('inProgress', { section: sectionTitles[test.resumeSection ?? 'listening'] });
    if (test.status === 'completed' && test.completedAt) return tc('completedOn', { date: format.dateTime(new Date(test.completedAt), { day: 'numeric', month: 'long' }) });
    return t('kinds.full');
  };

  const tag = (test: TestSummary) => (test.status === 'in_progress' ? tc('resumeShort') : t(`tags.${test.status === 'completed' ? 'done' : 'new'}`));

  return (
    <Panel
      title={t('title')}
      subtitle={t('subtitle')}
      action={
        <Link href={ROUTES.catalog} className="group flex items-center gap-1 text-[13px] font-medium">
          {t('catalog')}
          <Icon as={ArrowUpRight} size={14} strokeWidth={1.8} className="transition-transform duration-(--t-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      }
    >
      {tests.length === 0 ? (
        <p className="m-3 rounded-2xl bg-surface-muted px-6 py-10 text-center text-[13px] text-ink-2">{t('empty')}</p>
      ) : (
        <div className="flex flex-col overflow-x-auto px-3 pt-3 pb-2">
          <div className={`grid min-w-[560px] ${COLUMNS} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
            <span>{t('columns.test')}</span>
            <span>{t('columns.duration')}</span>
            <span>{t('columns.status')}</span>
            <span className="text-right">{t('columns.result')}</span>
            <span />
          </div>
          {tests.map((test) => (
            <Link
              key={test.id}
              href={hrefOf(test)}
              className={`group grid min-w-[560px] ${COLUMNS} h-14 items-center gap-4 rounded-[10px] px-3 text-[13px] text-ink transition-colors duration-(--t-fast) hover:bg-surface-muted hover:text-ink`}
            >
              <span className="flex min-w-0 flex-col leading-[1.35]">
                <span className="truncate font-medium">{test.title}</span>
                <span className="truncate text-xs text-ink-3">{detail(test)}</span>
              </span>
              <span className="font-mono text-xs text-ink-2">{test.durationLabel}</span>
              <Tag tone={TONE[test.status]} size="sm" className="justify-self-start">{tag(test)}</Tag>
              <span className="text-right font-mono text-xs">{test.score !== undefined ? `${test.score} · ${test.level}` : '—'}</span>
              <Icon as={ChevronRight} size={15} strokeWidth={1.75} className="justify-self-end text-ink-4 transition-[translate,color] duration-(--t-base) ease-out-expo group-hover:translate-x-0.5 group-hover:text-ink-2" />
            </Link>
          ))}
        </div>
      )}
    </Panel>
  );
}
