import { initLocale, metadataTitle, type PageProps } from '@/lib/i18n';
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
