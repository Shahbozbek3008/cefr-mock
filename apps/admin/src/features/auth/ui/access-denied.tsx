import type { Session } from '@supabase/supabase-js';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Panel } from '@/shared/ui';
import { signOut } from '../api/auth-api';
import { accountLabel } from '../lib/account-label';

const grantSql = (userId: string) => `update public.profiles set is_admin = true\nwhere id = '${userId}';`;

export function AccessDenied({ session }: { session: Session }) {
  const t = useTranslations('auth');
  const account = accountLabel(session.user);

  return (
    <div className="mx-auto grid min-h-dvh max-w-md place-items-center px-4">
      <Panel title={t('deniedTitle')}>
        <p className="mb-4 text-sm text-ink-2">{t('deniedText', { account })}</p>
        <pre className="mb-4 overflow-x-auto rounded-sm bg-surface-sunken p-3 text-xs text-ink">{grantSql(session.user.id)}</pre>
        <Button variant="secondary" size="sm" onClick={signOut}>
          {t('signOut')}
        </Button>
      </Panel>
    </div>
  );
}
