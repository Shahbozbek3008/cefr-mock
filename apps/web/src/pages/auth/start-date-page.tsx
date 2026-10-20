import { useTranslations } from 'use-intl';
import { AuthTopBar, BackLink, StepIndicator } from '@/features/auth/ui/auth-top-bar';
import { DateStep } from '@/features/auth/ui/onboarding-steps';
import { Stage } from '@/shared/ui/stage';
import { ROUTES } from '@/shared/config/routes';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function StartDatePage() {
  const t = useTranslations('onboarding');
  usePageTitle(t('date.title'));

  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.start} />} center={<StepIndicator current={2} />} />}>
      <DateStep />
    </Stage>
  );
}
