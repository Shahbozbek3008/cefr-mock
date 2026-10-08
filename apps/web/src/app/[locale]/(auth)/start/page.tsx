import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/lib/constants';
import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { ButtonLink } from '@/components/ui/button';
import { AuthTopBar, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { LevelPicker } from '@/components/auth/level-picker';

export const generateMetadata = metadataTitle('onboarding.goal.title');

function GoalView() {
  const t = useTranslations('onboarding');
  return (
    <Stage
      topBar={
        <AuthTopBar
          center={<StepIndicator current={1} />}
          end={<span className="text-[13px] text-ink-2 max-sm:hidden">{t.rich('haveAccount', { link: (c) => <Link href={ROUTES.login} className="font-medium">{c}</Link> })}</span>}
        />
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10 px-5 pb-10">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="m-0 text-[40px] leading-[1.05] font-medium tracking-[-0.045em]">{t('goal.title')}</h1>
          <p className="m-0 text-base text-ink-2">{t('goal.text')}</p>
        </div>
        <LevelPicker />
        <div className="flex w-full max-w-[748px] justify-end">
          <ButtonLink href={ROUTES.startDate} arrow className="min-w-[220px] max-sm:w-full">{t('continue')}</ButtonLink>
        </div>
      </div>
    </Stage>
  );
}

export default async function GoalPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <GoalView />;
}
