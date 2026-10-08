'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { PAYMENT_METHODS } from '@/lib/mock/plans';
import { RadioCardGroup, RadioDot } from '@/components/ui/controls';
import { PaymeLogo } from '@/components/ui/payme-logo';
import clickLogo from '@/assets/brands/click.png';

const LOGO_HEIGHT = 20;

export function PaymentMethods() {
  const t = useTranslations('billing');
  return (
    <RadioCardGroup
      items={PAYMENT_METHODS}
      defaultValue="click"
      label={t('paymentMethod')}
      className="grid grid-cols-2 gap-2"
      itemClassName="flex h-12 items-center gap-2.5 rounded-[12px] bg-surface pr-3 pl-4 shadow-inset hover:translate-y-0 data-[state=checked]:shadow-[inset_0_0_0_1.5px_var(--green-500)]"
      renderItem={(m) => (
        <>
          <span className="flex flex-1 items-center">
            {m.value === 'click' ? (
              <Image src={clickLogo} alt={m.name} height={LOGO_HEIGHT} style={{ width: 'auto', height: LOGO_HEIGHT }} />
            ) : (
              <PaymeLogo height={LOGO_HEIGHT} className="text-ink" />
            )}
          </span>
          <RadioDot size={18} />
        </>
      )}
    />
  );
}
