import { useParams, useSearchParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { AppMain } from '@/shared/ui/page-header';
import { ReviewView } from '@/features/review/ui/review-view';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function ReviewPage() {
  const { attemptId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const t = useTranslations('review');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-5">
      <ReviewView id={attemptId} initialTab={searchParams.get('tab') ?? undefined} />
    </AppMain>
  );
}
