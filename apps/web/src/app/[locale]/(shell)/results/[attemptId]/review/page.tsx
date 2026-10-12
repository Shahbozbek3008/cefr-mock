import { initLocale, metadataTitle } from '@cefr/ui/i18n/locale';
import { AppMain } from '@/components/layout/page-header';
import { ReviewView } from '@/components/results/review-view';
import type { ReviewPageProps } from '@/types/pages';

export const generateMetadata = metadataTitle('review.title');

export default async function ReviewPage({ params, searchParams }: ReviewPageProps) {
  await initLocale(params);
  const { attemptId } = await params;
  const { tab } = await searchParams;
  return (
    <AppMain className="gap-5">
      <ReviewView id={attemptId} initialTab={tab} />
    </AppMain>
  );
}
