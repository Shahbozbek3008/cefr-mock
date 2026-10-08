import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export const generateMetadata = metadataTitle('dashboard.metaTitle');

export default async function DashboardPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <DashboardView />;
}
