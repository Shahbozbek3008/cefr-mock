import { useSearchParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { Smartphone } from 'lucide-react';
import { PHONE_DIGITS, formatPhone, sanitizeDigits } from '@cefr/core';
import { Icon } from '@cefr/ui/components/icon';
import { Logo, LogoMark } from '@cefr/ui/components/logo';
import { richTags } from '@cefr/ui/lib/rich';
import { AuthTopBar, BackLink } from '@/features/auth/ui/auth-top-bar';
import { VerifyCodeForm } from '@/features/auth/ui/verify-code-form';
import { Stage } from '@/shared/ui/stage';
import { ROUTES } from '@/shared/config/routes';
import { Link, LocalizedNavigate } from '@/shared/i18n/navigation';
import { usePageTitle } from '@/shared/lib/use-page-title';

function VerifyBrand() {
  return (
    <>
      <span className="sm:hidden"><LogoMark /></span>
      <Logo className="max-sm:hidden" />
    </>
  );
}

function VerifyView({ digits }: { digits: string }) {
  const t = useTranslations('auth');
  return (
    <Stage topBar={<AuthTopBar start={<BackLink href={ROUTES.login} />} center={<VerifyBrand />} />}>
      <div className="flex flex-1 justify-center px-5 pt-4 pb-10 sm:items-center sm:pt-0 sm:pb-18">
        <div className="flex w-full max-w-[440px] flex-col gap-6 sm:gap-7 sm:rounded-card-lg sm:bg-surface sm:p-10 sm:shadow-[0_0_0_1px_rgb(var(--line-rgb)/.06),0_30px_60px_-30px_rgba(20,22,30,.2)]">
          <span className="grid size-12 place-items-center rounded-btn bg-green-100 text-green-text">
            <Icon as={Smartphone} size={22} />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="m-0 text-[26px] font-medium tracking-[-0.04em] sm:text-[28px]">{t('verify.title')}</h1>
            <p className="m-0 text-[15px] leading-[1.55] text-ink-2">
              {t.rich('verify.text', { ...richTags, phone: `+998 ${formatPhone(digits)}` })}{' '}
              <Link href={ROUTES.login}>{t('verify.change')}</Link>
            </p>
          </div>
          <VerifyCodeForm digits={digits} />
        </div>
      </div>
    </Stage>
  );
}

export default function LoginVerifyPage() {
  const [searchParams] = useSearchParams();
  const digits = sanitizeDigits(searchParams.get('phone') ?? '', PHONE_DIGITS);
  const t = useTranslations('auth');
  usePageTitle(t('verify.title'));

  if (digits.length !== PHONE_DIGITS) return <LocalizedNavigate to={ROUTES.login} />;
  return <VerifyView digits={digits} />;
}
