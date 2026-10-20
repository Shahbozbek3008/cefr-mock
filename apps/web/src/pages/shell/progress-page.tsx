import { useTranslations } from 'use-intl';
import { ProgressView } from '@/features/progress/ui/progress-view';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function ProgressPage() {
  const t = useTranslations('progress');
  usePageTitle(t('title'));
  return <ProgressView />;
}
