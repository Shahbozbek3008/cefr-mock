import { ROUTES } from '@/constants/routes';
import { initLocale, metadataTitle, type LocaleParams } from '@cefr/ui/i18n/locale';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { AccountStep } from '@/components/auth/onboarding-steps';

export const generateMetadata = metadataTitle('onboarding.account.title');

export default async function AccountPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.startDate} />} center={<StepIndicator current={3} partial />} />}>
      <AccountStep />
    </Stage>
  );
}
