import { useTranslations } from 'use-intl';
import { PAYMENT_METHODS } from '@cefr/ui/lib/plans';
import { RadioCardGroup, RadioDot } from '@cefr/ui/components/controls';
import { PaymeLogo } from '@cefr/ui/components/payme-logo';
import clickLogoDark from '@/shared/assets/brands/click-dark.png';
import clickLogoLight from '@/shared/assets/brands/click-light.png';
import { LOGO_HEIGHT } from '@/features/billing/model/constants';

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
              <>
                <img src={clickLogoLight} alt={m.name} height={LOGO_HEIGHT} className="dark:hidden" style={{ width: 'auto', height: LOGO_HEIGHT }} />
                <img src={clickLogoDark} alt={m.name} height={LOGO_HEIGHT} className="hidden dark:block" style={{ width: 'auto', height: LOGO_HEIGHT }} />
              </>
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
