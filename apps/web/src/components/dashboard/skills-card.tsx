import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { MAX_SCORE, SKILLS, SKILL_ICONS, type Skill } from '@/lib/constants';
import { Icon } from '@/components/ui/icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { CountUp } from '@/components/motion/count-up';
import { Delta } from '@/components/app/delta';
import { Panel } from './panel';

export type SkillScore = { skill: Skill; score: number; delta: number; weak?: boolean };

type SkillsCardProps = { skills: readonly SkillScore[]; title: string; subtitle: string };

function SkillRow({ skill, label, bar, score }: { skill: Skill; label: ReactNode; bar: ReactNode; score: ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_1fr_auto] items-center gap-3 rounded-[10px] px-2 py-2 transition-colors duration-(--t-fast) hover:bg-surface-muted">
      <span className="grid size-7 place-items-center rounded-[8px] bg-surface-sunken text-ink-2">
        <Icon as={SKILL_ICONS[skill]} size={14} strokeWidth={1.7} />
      </span>
      <span className="flex min-w-0 flex-col gap-1.5">
        <span className="flex items-center gap-2 text-[13px]">{label}</span>
        {bar}
      </span>
      <span className="flex w-16 flex-col items-end gap-0.5">{score}</span>
    </li>
  );
}

export function SkillsCardSkeleton({ title, subtitle }: Omit<SkillsCardProps, 'skills'>) {
  const ts = useTranslations('skills');
  return (
    <Panel title={title} subtitle={subtitle}>
      <ul className="m-0 flex list-none flex-col gap-1 p-3">
        {SKILLS.map((skill) => (
          <SkillRow
            key={skill}
            skill={skill}
            label={ts(skill)}
            bar={<Skeleton className="h-[3px] w-full rounded-[2px]" />}
            score={<SkeletonText className="w-8 font-mono text-[13px]" />}
          />
        ))}
      </ul>
    </Panel>
  );
}

export function SkillsCard({ skills, title, subtitle }: SkillsCardProps) {
  const t = useTranslations('dashboard.skills');
  const ts = useTranslations('skills');
  return (
    <Panel title={title} subtitle={subtitle}>
      {skills.length === 0 ? (
        <p className="m-3 flex flex-1 items-center justify-center rounded-2xl bg-surface-muted px-6 py-10 text-center text-[13px] leading-normal text-ink-2">{t('empty')}</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-1 p-3">
          {skills.map((s, i) => (
            <SkillRow
              key={s.skill}
              skill={s.skill}
              label={
                <>
                  {ts(s.skill)}
                  {s.weak && <span className="rounded-[5px] bg-warning-50 px-1.5 text-[10px] font-medium text-warning-text">{t('weak')}</span>}
                </>
              }
              bar={<ProgressBar value={s.score} max={MAX_SCORE} size="xs" tone={s.weak ? 'warning' : 'blue'} delay={i * 0.1} />}
              score={
                <>
                  <span className="font-mono text-[13px]"><CountUp value={s.score} delay={i * 0.1} /></span>
                  {s.delta !== 0 && <Delta value={s.delta} className="text-[10px]" />}
                </>
              }
            />
          ))}
        </ul>
      )}
    </Panel>
  );
}
