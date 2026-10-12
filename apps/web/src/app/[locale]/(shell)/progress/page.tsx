import { initLocale, metadataTitle, type LocaleParams } from '@cefr/ui/i18n/locale';
import { ProgressView } from '@/components/progress/progress-view';

export const generateMetadata = metadataTitle('progress.title');

export default async function ProgressPage({ params }: { params: LocaleParams }) {
  await initLocale(params);
  return <ProgressView />;
}
