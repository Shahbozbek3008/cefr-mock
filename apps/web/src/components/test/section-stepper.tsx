import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { SKILLS, type Skill } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/icon';

export function SectionStepper({ current }: { current: Skill }) {
  const t = useTranslations('skills');
  const currentIndex = SKILLS.indexOf(current);

  return (
    <ol className="m-0 flex list-none items-center gap-1.5 p-0 max-lg:hidden">
      {SKILLS.map((skill, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming';
        return (
          <Fragment key={skill}>
            {i > 0 && <li aria-hidden className="h-px w-[14px] bg-line" />}
            <li
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(
                'flex h-8 items-center gap-2 rounded-sm px-3 text-[13px]',
                state === 'done' && 'text-ink-2',
                state === 'current' && 'bg-surface-sunken font-medium text-ink',
                state === 'upcoming' && 'text-ink-3',
              )}
            >
              {state === 'done' ? (
                <span className="grid size-4 animate-pop place-items-center rounded-full bg-green-100 text-green-text"><Icon as={Check} size={10} strokeWidth={3} /></span>
              ) : (
                <span className={cn('size-1.5 rounded-full', state === 'current' ? 'animate-pulse bg-blue' : 'bg-line-strong')} />
              )}
              {t(skill)}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
