import { useParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { AppMain } from '@/shared/ui/page-header';
import { SpeakingReview } from '@/features/ai-review/ui/speaking-review';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function AiSpeakingPage() {
  const { attemptId = '' } = useParams();
  const t = useTranslations('aiSpeaking');
  usePageTitle(t('title'));

  return (
    <AppMain className="gap-5">
      <SpeakingReview id={attemptId} />
    </AppMain>
  );
}
