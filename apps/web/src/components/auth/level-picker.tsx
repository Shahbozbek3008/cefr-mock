'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { LEVELS } from '@/lib/constants';
import { RadioCardGroup } from '@/components/ui/controls';
import { Icon } from '@/components/ui/icon';

export function LevelPicker({ value, onChange }: { value: string | null; onChange: (value: string) => void }) {
  const t = useTranslations('onboarding.goal');
  return (
    <RadioCardGroup
      items={LEVELS.map((l) => ({ ...l, value: l.code }))}
      value={value ?? ''}
      onValueChange={onChange}
      label={t('title')}
      className="stagger grid w-full max-w-[748px] gap-[14px] sm:grid-cols-3"
      itemClassName="flex flex-col gap-7 rounded-card bg-surface p-6 shadow-e0 hover:shadow-e1 data-[state=checked]:bg-green-50 data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--green-500),0_20px_40px_-24px_oklch(0.45_0.14_140/.45)]"
      renderItem={(level) => (
        <>
          <span className="flex items-start justify-between">
            <span className="grid size-[52px] place-items-center rounded-2xl bg-surface-sunken text-lg font-medium tracking-[-0.02em] text-ink-body transition-[background-color,color,scale,rotate] duration-(--t-sheet) ease-spring group-hover:scale-105 group-data-[state=checked]:-rotate-3 group-data-[state=checked]:bg-action group-data-[state=checked]:text-white">
              {level.code}
            </span>
            <span className="grid size-[22px] place-items-center rounded-full bg-surface text-white shadow-[inset_0_0_0_1.5px_var(--border-strong)] transition-[background-color,box-shadow] duration-(--t-base) group-data-[state=checked]:bg-green group-data-[state=checked]:shadow-none">
              <Icon as={Check} size={11} strokeWidth={3} className="hidden animate-pop group-data-[state=checked]:block" />
            </span>
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[17px] font-medium">{t(`levels.${level.code}`)}</span>
            <span className="font-mono text-xs text-ink-2">{t('range', { min: level.min, max: level.max })}</span>
          </span>
        </>
      )}
    />
  );
}
