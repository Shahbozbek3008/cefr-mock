import { useTranslations } from 'next-intl';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { LATEST_RESULT } from '@/lib/mock/results';
import { RECOMMENDED } from '@/lib/mock/tests';
import { Icon } from '@/components/ui/icon';
import { Tag } from '@/components/ui/tag';
import { Panel } from './panel';

const HREF: Record<(typeof RECOMMENDED)[number]['kind'], string> = {
  full: ROUTES.test('13'),
  drill: ROUTES.testSection('13', 'writing'),
  done: ROUTES.result(LATEST_RESULT.attemptId),
};

const COLUMNS = 'grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_80px_24px]';

export function RecommendedTable() {
  const t = useTranslations('dashboard.recommended');
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
      <div className="flex flex-col px-3 pt-3 pb-2">
        <div className={`grid ${COLUMNS} gap-4 px-3 pb-2 text-[11px] font-medium text-ink-3 shadow-[0_1px_0_var(--divider)]`}>
          <span>{t('columns.test')}</span>
          <span>{t('columns.duration')}</span>
          <span>{t('columns.status')}</span>
          <span className="text-right">{t('columns.result')}</span>
          <span />
        </div>
        {RECOMMENDED.map((test) => (
          <Link
            key={test.id}
            href={HREF[test.kind]}
            className={`group grid ${COLUMNS} h-14 items-center gap-4 rounded-[10px] px-3 text-[13px] text-ink transition-colors duration-(--t-fast) hover:bg-surface-muted hover:text-ink`}
          >
            <span className="flex min-w-0 flex-col leading-[1.35]">
              <span className="truncate font-medium">{test.name}</span>
              <span className="truncate text-xs text-ink-3">{t(`kinds.${test.kind}`)}</span>
            </span>
            <span className="font-mono text-xs text-ink-2">{t(test.kind === 'drill' ? 'minutes' : 'hours', { value: test.duration })}</span>
            <Tag tone={test.tone} size="sm" className="justify-self-start">{t(`tags.${test.tag}`)}</Tag>
            <span className="text-right font-mono text-xs">{test.result}</span>
            <Icon as={ChevronRight} size={15} strokeWidth={1.75} className="justify-self-end text-ink-4 transition-[translate,color] duration-(--t-base) ease-out-expo group-hover:translate-x-0.5 group-hover:text-ink-2" />
          </Link>
        ))}
      </div>
    </Panel>
  );
}
