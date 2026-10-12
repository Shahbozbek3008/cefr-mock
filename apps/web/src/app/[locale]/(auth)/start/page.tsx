import { useTranslations } from 'next-intl';
import { Link } from '@cefr/ui/i18n/navigation';
import { ROUTES } from '@/constants/routes';
import { initLocale, type LocaleParams } from '@cefr/ui/i18n/locale';
import { StructuredData } from '@/components/seo/structured-data';
import { PUBLIC_PAGES } from '@/constants/seo';
import { publicPageMetadata } from '@/lib/seo';
import { AuthTopBar, StepIndicator } from '@/components/auth/auth-top-bar';
import { Stage } from '@/components/layout/stage';
import { GoalStep } from '@/components/auth/onboarding-steps';

export const generateMetadata = publicPageMetadata(PUBLIC_PAGES[1]);

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
        <GoalStep />
      </div>
    </Stage>
  );
}

export default async function GoalPage({ params }: { params: LocaleParams }) {
  const locale = await initLocale(params);
  return (
    <>
      <StructuredData locale={locale} path={PUBLIC_PAGES[1].path} />
      <GoalView />
    </>
  );
}
