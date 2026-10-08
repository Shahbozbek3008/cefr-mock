'use client';

import { useTranslations } from 'next-intl';
import { PAYMENT_METHODS } from '@/lib/mock/plans';
import { RadioCardGroup, RadioDot } from '@/components/ui/controls';

export function PaymentMethods() {
  const t = useTranslations('billing');
  return (
    <RadioCardGroup
      items={PAYMENT_METHODS}
      defaultValue="click"
      label={t('paymentMethod')}
      className="grid grid-cols-2 gap-2"
      itemClassName="flex h-11 items-center gap-2.5 rounded-[12px] bg-surface px-3 shadow-inset hover:translate-y-0 data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--green-500)]"
      renderItem={(m) => (
        <>
          <span className="grid size-6 place-items-center rounded-[7px] text-[11px] font-semibold text-white" style={{ background: m.color }}>{m.letter}</span>
          <span className="flex-1 text-[13px] font-medium">{m.name}</span>
          <RadioDot size={18} />
        </>
      )}
    />
  );
}
