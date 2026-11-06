import { Navigate } from 'react-router';
import { useTranslations } from 'use-intl';
import { LocaleSwitcher } from '@cefr/ui/components/locale-switcher';
import { PageTitle } from '@cefr/ui/components/typography';
import { LoginForm, useAuth } from '@/features/auth';
import { IS_CONFIGURED } from '@/shared/config/env';
import { Notice } from '@/shared/ui';

export default function LoginPage() {
  const t = useTranslations('auth');
  const auth = useAuth();

  if (auth.status === 'admin' || auth.status === 'denied') return <Navigate to="/" replace />;

  return (
    <div className="grid min-h-dvh place-items-center bg-bg-app px-4">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <PageTitle meta={t('subtitle')} title={t('title')} />
          <LocaleSwitcher variant="compact" />
        </div>
        {!IS_CONFIGURED && <Notice tone="error">{t('notConfigured')}</Notice>}
        <LoginForm />
      </div>
    </div>
  );
}
