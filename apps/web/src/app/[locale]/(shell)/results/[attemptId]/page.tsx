import { initLocale, metadataTitle, type PageProps } from '@cefr/ui/i18n/locale';
import { AppMain } from '@/components/layout/page-header';
import { ResultOverview } from '@/components/results/result-overview';

export const generateMetadata = metadataTitle('results.metaTitle');

export default async function ResultPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  const { attemptId } = await params;
  return (
    <AppMain className="gap-5">
      <ResultOverview id={attemptId} />
    </AppMain>
  );
}
