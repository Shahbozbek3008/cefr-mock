import { initLocale, metadataTitle, type PageProps } from '@cefr/ui/i18n/locale';
import { TestIntro } from '@/components/exam/test-intro';

export const generateMetadata = metadataTitle('pretest.title');

export default async function PretestPage({ params }: PageProps<{ id: string }>) {
  await initLocale(params);
  const { id } = await params;
  return <TestIntro id={id} />;
}
