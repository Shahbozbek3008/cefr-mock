import { useTranslations } from 'use-intl';
import { toAppError } from '@/shared/api/app-error';
import { Notice } from './notice';

export function ErrorNotice({ error }: { error: unknown }) {
  const t = useTranslations('errors');
  if (!error) return null;
  const { code, values } = toAppError(error);
  return <Notice tone="error">{t(code, values)}</Notice>;
}
