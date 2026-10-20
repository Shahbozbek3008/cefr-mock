import { useSearchParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { PHONE_DIGITS, sanitizeDigits } from '@cefr/core';
import { AuthTopBar, BackLink, StepIndicator } from '@/features/auth/ui/auth-top-bar';
import { VerifyStep } from '@/features/auth/ui/onboarding-steps';
import { Stage } from '@/shared/ui/stage';
import { ROUTES } from '@/shared/config/routes';
import { LocalizedNavigate } from '@/shared/i18n/navigation';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function StartVerifyPage() {
  const [searchParams] = useSearchParams();
  const digits = sanitizeDigits(searchParams.get('phone') ?? '', PHONE_DIGITS);
  const t = useTranslations('onboarding');
  usePageTitle(t('done.title'));

  if (digits.length !== PHONE_DIGITS) return <LocalizedNavigate to={ROUTES.startAccount} />;

  return (
    <Stage glow topBar={<AuthTopBar start={<BackLink href={ROUTES.startAccount} />} center={<StepIndicator current={3} />} />}>
      <div className="flex flex-1 items-center justify-center px-5 pb-10">
        <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-hero bg-surface px-10 py-9 shadow-[0_0_0_1px_rgb(var(--line-rgb)/.05),0_40px_80px_-40px_rgba(20,22,30,.3)] max-sm:px-6">
          <VerifyStep digits={digits} />
        </div>
      </div>
    </Stage>
  );
}
