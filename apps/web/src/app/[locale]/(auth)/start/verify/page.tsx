import { useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/constants';
import { MOCK_EXAM, MOCK_USER } from '@/lib/mock/user';
import { richTags } from '@/lib/rich';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { ButtonLink } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { StatGrid } from '@/components/ui/stat-grid';
import { SuccessBadge } from '@/components/ui/success-badge';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';

export const generateMetadata = metadataTitle('onboarding.done.title');

function DoneView() {
  const t = useTranslations('onboarding.done');
  const ta = useTranslations('auth.verify');
  return (
    <Stage glow topBar={<AuthTopBar start={<BackLink href={ROUTES.startAccount} />} center={<StepIndicator current={3} />} />}>
      <div className="flex flex-1 items-center justify-center px-5 pb-10">
        <div className="flex w-full max-w-[480px] flex-col gap-6 rounded-hero bg-surface px-10 py-9 shadow-[0_0_0_1px_rgba(20,22,30,.05),0_40px_80px_-40px_rgba(20,22,30,.3)] max-sm:px-6">
          <SuccessBadge />
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[28px] font-medium tracking-[-0.04em]">{t('title')}</h1>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{t.rich('text', { ...richTags, phone: `+998 ${MOCK_USER.phone}` })}</p>
          </div>
          <OtpInput label={ta('otpLabel')} defaultValue="481927" success size="md" />
          <StatGrid
            stats={[
              { value: MOCK_EXAM.daysLeft, label: t('stats.days') },
              { value: MOCK_EXAM.mockTests, label: t('stats.tests') },
              { value: MOCK_EXAM.dailyMinutes, label: t('stats.minutes') },
            ]}
          />
          <div className="flex flex-col gap-2">
            <ButtonLink href={ROUTES.test('13')} arrow block>{t('startFree')}</ButtonLink>
            <ButtonLink href={ROUTES.dashboard} variant="secondary" block className="h-12">{t('toDashboard')}</ButtonLink>
          </div>
        </div>
      </div>
    </Stage>
  );
}

export default async function DonePage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <DoneView />;
}
