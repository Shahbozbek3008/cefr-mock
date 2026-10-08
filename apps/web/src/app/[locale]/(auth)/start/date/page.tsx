import { ROUTES } from '@/lib/constants';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { DateStep } from '@/components/auth/onboarding-steps';

export const generateMetadata = metadataTitle('onboarding.date.title');

export default async function DatePage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.start} />} center={<StepIndicator current={2} />} />}>
      <DateStep />
    </Stage>
  );
}
