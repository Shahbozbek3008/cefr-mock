import { useTranslations } from 'next-intl';
import { Clock3 } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { IN_PROGRESS } from '@/lib/mock/tests';
import { Icon } from '@/components/ui/icon';
import { Ring } from '@/components/ui/gauge';
import { ButtonLink } from '@/components/ui/button';
import { CountUp } from '@/components/motion/count-up';
import { Panel } from './panel';

export function ContinueCard() {
  const t = useTranslations('dashboard.continue');
  return (
    <Panel className="gap-4 p-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-2">{t('label')}</span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-2">
          <Icon as={Clock3} size={12} strokeWidth={1.8} />
          {t('left', { time: IN_PROGRESS.left })}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Ring value={IN_PROGRESS.progress} max={100} size={64} stroke={6} r={26}>
          <span className="font-mono text-[13px] font-medium"><CountUp value={IN_PROGRESS.progress} />%</span>
        </Ring>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[17px] font-medium tracking-[-0.02em]">{IN_PROGRESS.name}</span>
          <span className="text-[13px] leading-snug text-ink-2">
            {t('meta', { section: IN_PROGRESS.section, part: IN_PROGRESS.part, answered: IN_PROGRESS.answered, total: IN_PROGRESS.total })}
          </span>
        </div>
      </div>
      <ButtonLink href={ROUTES.testSection(IN_PROGRESS.id, 'reading')} size="xs" arrow block className="h-9 rounded-[10px] text-[13px]">
        {t('cta')}
      </ButtonLink>
    </Panel>
  );
}
