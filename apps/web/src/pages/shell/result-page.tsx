import { useParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { AppMain } from '@/shared/ui/page-header';
import { ResultOverview } from '@/features/result/ui/result-overview';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function ResultPage() {
  const { attemptId = '' } = useParams();
  const t = useTranslations('results');
  usePageTitle(t('metaTitle'));

  return (
    <AppMain className="gap-5">
      <ResultOverview id={attemptId} />
    </AppMain>
  );
}
