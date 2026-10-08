import { initLocale, metadataTitle, type LocaleParams } from '@/lib/i18n';
import { ProgressView } from '@/components/progress/progress-view';

export const generateMetadata = metadataTitle('progress.title');

export default async function ProgressPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <ProgressView />;
}
