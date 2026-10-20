import { useTranslations } from 'use-intl';
import { DashboardView } from '@/features/dashboard/ui/dashboard-view';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  usePageTitle(t('metaTitle'));
  return <DashboardView />;
}
