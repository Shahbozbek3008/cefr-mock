import { PHONE_DIGITS, sanitizeDigits } from '@cefr/core';
import { redirect } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { VerifyStep } from '@/components/auth/onboarding-steps';

export const generateMetadata = metadataTitle('onboarding.done.title');

type VerifyPageProps = { params: LocaleParams; searchParams: Promise<{ phone?: string }> };

export default async function VerifyPage({ params, searchParams }: VerifyPageProps) {
  const locale = await initLocale(params);
  const digits = sanitizeDigits((await searchParams).phone ?? '', PHONE_DIGITS);
  if (digits.length !== PHONE_DIGITS) redirect({ href: ROUTES.startAccount, locale });
  return (
    <Stage glow topBar={<AuthTopBar start={<BackLink href={ROUTES.startAccount} />} center={<StepIndicator current={3} />} />}>
      <div className="flex flex-1 items-center justify-center px-5 pb-10">
        <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-hero bg-surface px-10 py-9 shadow-[0_0_0_1px_rgba(20,22,30,.05),0_40px_80px_-40px_rgba(20,22,30,.3)] max-sm:px-6">
          <VerifyStep digits={digits} />
        </div>
      </div>
    </Stage>
  );
}
