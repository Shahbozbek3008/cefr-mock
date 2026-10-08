import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
import { AppMain } from '@/components/layout/page-header';
import { ReviewView } from '@/components/results/review-view';

export const generateMetadata = metadataTitle('review.title');

type ReviewPageProps = PageProps<{ attemptId: string }> & { searchParams: Promise<{ tab?: string }> };

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
