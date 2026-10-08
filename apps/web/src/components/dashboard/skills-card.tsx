import { useTranslations } from 'next-intl';
import { MAX_SCORE, SKILL_ICONS } from '@/lib/constants';
import type { SkillScore } from '@/lib/mock/results';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CountUp } from '@/components/motion/count-up';
import { Delta } from '@/components/app/delta';
import { Panel } from './panel';

type SkillsCardProps = { skills: readonly SkillScore[]; title: string; subtitle: string };

export function SkillsCard({ skills, title, subtitle }: SkillsCardProps) {
  const t = useTranslations('dashboard.skills');
  const ts = useTranslations('skills');
  return (
    <Panel title={title} subtitle={subtitle}>
      <ul className="m-0 flex list-none flex-col gap-1 p-3">
        {skills.map((s, i) => (
          <li key={s.skill} className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-[10px] px-2 py-2 transition-colors duration-(--t-fast) hover:bg-surface-muted">
            <span className="grid size-7 place-items-center rounded-[8px] bg-surface-sunken text-ink-2">
              <Icon as={SKILL_ICONS[s.skill]} size={14} strokeWidth={1.7} />
            </span>
            <span className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-center gap-2 text-[13px]">
                {ts(s.skill)}
                {s.weak && <span className="rounded-[5px] bg-warning-50 px-1.5 text-[10px] font-medium text-warning-text">{t('weak')}</span>}
              </span>
              <ProgressBar value={s.score} max={MAX_SCORE} size="xs" tone={s.weak ? 'warning' : 'blue'} delay={i * 0.1} />
            </span>
            <span className="flex w-16 flex-col items-end gap-0.5">
              <span className="font-mono text-[13px]"><CountUp value={s.score} delay={i * 0.1} /></span>
              <Delta value={s.delta} className="text-[10px]" />
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
