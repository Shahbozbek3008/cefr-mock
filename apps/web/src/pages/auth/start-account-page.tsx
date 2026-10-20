import { useTranslations } from 'use-intl';
import { AuthTopBar, BackLink, StepIndicator } from '@/features/auth/ui/auth-top-bar';
import { AccountStep } from '@/features/auth/ui/onboarding-steps';
import { Stage } from '@/shared/ui/stage';
import { ROUTES } from '@/shared/config/routes';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function StartAccountPage() {
  const t = useTranslations('onboarding');
  usePageTitle(t('account.title'));

  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.startDate} />} center={<StepIndicator current={3} partial />} />}>
      <AccountStep />
    </Stage>
  );
}
