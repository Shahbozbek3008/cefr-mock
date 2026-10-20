import { useParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { AppMain } from '@/shared/ui/page-header';
import { WritingReview } from '@/features/ai-review/ui/writing-review';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function AiWritingPage() {
  const { attemptId = '' } = useParams();
  const t = useTranslations('aiWriting');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-5">
      <WritingReview id={attemptId} />
    </AppMain>
  );
}
