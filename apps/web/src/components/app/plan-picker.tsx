'use client';

import { useTranslations } from 'next-intl';
import { PLANS, RECOMMENDED_PLAN, type PlanId } from '@/lib/mock/plans';
import { formatSum } from '@/lib/format';
import { Tag } from '@/components/ui/tag';
import { RadioCardGroup, RadioDot } from '@/components/ui/controls';

type PlanPickerProps = { value: PlanId; onChange: (value: PlanId) => void };

export function PlanPicker({ value, onChange }: PlanPickerProps) {
  const t = useTranslations('plans');
  const tb = useTranslations('billing');
  return (
    <RadioCardGroup
      items={PLANS.map((p) => ({ ...p, value: p.id }))}
      value={value}
      onValueChange={(next) => onChange(next as PlanId)}
      label={tb('choosePeriod')}
      className="flex flex-col overflow-hidden rounded-[14px] shadow-[0_0_0_1px_var(--border)]"
      itemClassName="relative flex items-center gap-3.5 bg-surface px-4 py-3.5 shadow-[0_-1px_0_var(--border)] first:shadow-none hover:translate-y-0 hover:bg-surface-muted data-[state=checked]:z-10 data-[state=checked]:bg-green-50/70 data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--green-500)] first:rounded-t-[14px] last:rounded-b-[14px]"
      renderItem={(plan) => (
        <>
          <RadioDot size={18} />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
              {t(`${plan.id}.name`)}
              {plan.id === RECOMMENDED_PLAN && <Tag tone="blue" size="sm" className="h-5 px-1.5 text-[10.5px]">{tb('recommended')}</Tag>}
            </span>
            <span className="text-xs text-ink-3">
              {plan.perMonth ? t('perMonth', { price: formatSum(plan.perMonth) }) : t('everyMonth')}
            </span>
          </span>
          <span className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-sm font-medium">{formatSum(plan.price)}</span>
            {plan.discount ? (
              <span className="rounded-[5px] bg-green-100 px-1.5 text-[10.5px] font-medium text-green-text">−{plan.discount}%</span>
            ) : (
              <span className="text-[10.5px] text-ink-3">{t('currency')}</span>
            )}
          </span>
        </>
      )}
    />
  );
}
