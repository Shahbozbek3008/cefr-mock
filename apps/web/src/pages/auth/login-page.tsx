import { useTranslations } from 'use-intl';
import { Logo } from '@cefr/ui/components/logo';
import { LoginShowcase } from '@/features/auth/ui/login-showcase';
import { PhoneLoginForm } from '@/features/auth/ui/phone-login-form';
import { OrDivider, SocialButtons } from '@/features/auth/ui/social-buttons';
import { LANDING_URL } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';
import { Link } from '@/shared/i18n/navigation';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function LoginPage() {
  const t = useTranslations('auth');
  usePageTitle(t('login.title'));

  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[560px_1fr]">
      <div className="flex flex-col px-5 pt-6 pb-8 max-lg:items-center sm:px-16 sm:py-10">
        <div className="w-full max-w-[400px] lg:max-w-none">
          <a href={LANDING_URL} className="inline-flex"><Logo /></a>
        </div>
        <div className="my-auto flex w-full max-w-[400px] flex-col gap-7 py-10 sm:gap-8">
          <div className="flex flex-col gap-2.5">
            <h1 className="m-0 text-[32px] leading-[1.05] font-medium tracking-[-0.045em] sm:text-4xl">{t('login.title')}</h1>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-2">{t('login.subtitle')}</p>
          </div>
          <PhoneLoginForm />
          <OrDivider />
          <SocialButtons />
        </div>
        <div className="flex w-full max-w-[400px] flex-wrap justify-between gap-x-4 gap-y-2 text-[13px] text-ink-2 lg:max-w-none">
          <span>{t.rich('login.noAccount', { link: (c) => <Link href={ROUTES.start} className="font-medium">{c}</Link> })}</span>
          <span className="text-ink-3">{t('legal')}</span>
        </div>
      </div>
      <LoginShowcase />
    </div>
  );
}
