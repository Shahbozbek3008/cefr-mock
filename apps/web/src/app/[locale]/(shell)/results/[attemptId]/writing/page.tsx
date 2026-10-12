import { initLocale, metadataTitle, type PageProps } from '@cefr/ui/i18n/locale';
import { AppMain } from '@/components/layout/page-header';
import { WritingReview } from '@/components/results/writing-review';

export const generateMetadata = metadataTitle('aiWriting.title');

export default async function AiWritingPage({ params }: PageProps<{ attemptId: string }>) {
  await initLocale(params);
  const { attemptId } = await params;
  return (
    <AppMain className="gap-5">
      <WritingReview id={attemptId} />
    </AppMain>
  );
}
