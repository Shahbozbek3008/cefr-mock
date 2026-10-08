import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
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
