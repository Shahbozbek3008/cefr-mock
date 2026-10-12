import { initLocale, metadataTitle, type PageProps } from '@cefr/ui/i18n/locale';
import { AppMain } from '@/components/layout/page-header';
import { SpeakingReview } from '@/components/results/speaking-review';

export const generateMetadata = metadataTitle('aiSpeaking.title');

export default async function AiSpeakingPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  const { attemptId } = await params;
  return (
    <AppMain className="gap-5">
      <SpeakingReview id={attemptId} />
    </AppMain>
  );
}
