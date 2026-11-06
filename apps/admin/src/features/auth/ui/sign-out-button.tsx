import { LogOut } from 'lucide-react';
import { useTranslations } from 'use-intl';
import { IconButton } from '@cefr/ui/components/icon-button';
import { signOut } from '../api/auth-api';

export function SignOutButton() {
  const t = useTranslations('auth');
  return <IconButton size="sm" icon={LogOut} label={t('signOut')} onClick={signOut} />;
}
