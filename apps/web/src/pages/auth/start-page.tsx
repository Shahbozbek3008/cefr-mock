import { useTranslations } from 'use-intl';
import { AuthTopBar, StepIndicator } from '@/features/auth/ui/auth-top-bar';
import { GoalStep } from '@/features/auth/ui/onboarding-steps';
import { Stage } from '@/shared/ui/stage';
import { ROUTES } from '@/shared/config/routes';
import { Link } from '@/shared/i18n/navigation';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function StartPage() {
  const t = useTranslations('onboarding');
  usePageTitle(t('goal.title'));

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
        <GoalStep />
      </div>
    </Stage>
  );
}
