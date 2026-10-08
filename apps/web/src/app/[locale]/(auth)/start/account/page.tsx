import { useTranslations } from 'next-intl';
import { ROUTES } from '@/lib/constants';
import { MOCK_USER } from '@/lib/mock/user';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { ButtonLink } from '@/components/ui/button';
import { Field, PhoneInput, TextInput } from '@/components/ui/field';
import { Checkbox } from '@/components/ui/controls';
import { AuthTopBar, BackLink, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { SocialButtons } from '@/components/auth/social-buttons';
import { PlanSummary } from '@/components/auth/plan-summary';
import { OnboardingSplit } from '@/components/auth/onboarding-split';

export const generateMetadata = metadataTitle('onboarding.account.title');

function AccountView() {
  const t = useTranslations('onboarding.account');
  const ta = useTranslations('auth');
  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.startDate} />} center={<StepIndicator current={3} partial />} />}>
      <OnboardingSplit title={t('title')} text={t('text')} aside={<PlanSummary />}>
        <Field label={t('name')} htmlFor="name">
          <TextInput id="name" name="name" defaultValue={MOCK_USER.firstName} autoComplete="given-name" />
        </Field>
        <Field label={ta('phone')} htmlFor="phone" hint={t('smsHint')}>
          <PhoneInput id="phone" name="phone" defaultValue={MOCK_USER.phone} />
        </Field>
        <Checkbox id="consent" defaultChecked>
          {t.rich('consent', { terms: (c) => <a href="#">{c}</a>, privacy: (c) => <a href="#">{c}</a> })}
        </Checkbox>
        <ButtonLink href={ROUTES.startVerify} size="md" arrow block className="h-11 rounded-[12px]">{ta('sendCode')}</ButtonLink>
        <SocialButtons />
      </OnboardingSplit>
    </Stage>
  );
}

export default async function AccountPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <AccountView />;
}
