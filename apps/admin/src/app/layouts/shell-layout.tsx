import { Link, Outlet } from 'react-router';
import { useTranslations } from 'use-intl';
import { LocaleSwitcher } from '@cefr/ui/components/locale-switcher';
import { Logo } from '@cefr/ui/components/logo';
import { Tag } from '@cefr/ui/components/tag';
import { SignOutButton, accountLabel, useAuth } from '@/features/auth';

export function ShellLayout() {
  const t = useTranslations('shell');
  const auth = useAuth();
  const account = auth.status === 'admin' ? accountLabel(auth.session.user) : undefined;

  return (
    <div className="min-h-dvh bg-bg-app">
      <header className="border-b border-divider bg-surface">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo size="md" />
            <Tag tone="sunken" size="sm">
              {t('badge')}
            </Tag>
          </Link>
          <span className="ml-auto hidden text-sm text-ink-3 sm:inline">{account}</span>
          <LocaleSwitcher variant="compact" />
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
