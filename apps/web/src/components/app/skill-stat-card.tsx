import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { MAX_SCORE, SKILL_ICONS } from '@/lib/constants';
import type { SkillScore } from '@/lib/mock/results';
import { Link } from '@/i18n/navigation';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { BigNumber } from '@/components/ui/typography';
import { CountUp } from '@/components/motion/count-up';
import { Delta } from './delta';

type SkillStatCardProps = SkillScore & { variant?: 'compact' | 'detailed'; href?: string };

export function SkillStatCard({ skill, score, delta, weak, variant = 'compact', href }: SkillStatCardProps) {
  const t = useTranslations('skills');
  const tr = useTranslations('results');
  const detailed = variant === 'detailed';

  return (
    <Card interactive className={detailed ? 'group flex flex-col gap-[14px] p-5' : 'group flex flex-col gap-[14px] rounded-[20px] p-[18px] shadow-[0_0_0_1px_rgba(20,22,30,.05)]'}>
      <div className="flex items-center justify-between">
        <span className={detailed ? 'flex items-center gap-2.5 text-sm text-ink-body' : 'text-[13px] text-ink-2'}>
          {detailed && <Icon as={SKILL_ICONS[skill]} size={17} strokeWidth={1.5} className="text-ink-2" />}
          {t(skill)}
        </span>
        <Delta value={delta} className={detailed ? undefined : 'text-[11px]'} />
      </div>
      <BigNumber value={<CountUp value={score} />} max={`/${MAX_SCORE}`} size={detailed ? 40 : 32} className={detailed ? undefined : 'tracking-[-0.05em]'} />
      <ProgressBar value={score} max={MAX_SCORE} tone={weak ? 'warning' : 'blue'} size={detailed ? 'sm' : 'xs'} />
      {detailed && href && (
        <Link href={href} className="flex items-center gap-1 text-[13px] font-medium">
          {tr('viewAnalysis')}
          <Icon as={ChevronRight} size={13} strokeWidth={1.8} className="transition-transform duration-(--t-base) group-hover:translate-x-0.5" />
        </Link>
      )}
    </Card>
  );
}
