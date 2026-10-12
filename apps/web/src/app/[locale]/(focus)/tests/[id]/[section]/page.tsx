import { initLocale, metadataTitle } from '@cefr/ui/i18n/locale';
import { assertSkill } from '@/lib/test-route';
import { ExamSectionScreen } from '@/components/exam/exam-section-screen';
import type { TestSectionPageProps } from '@/types/pages';

export const generateMetadata = metadataTitle('test.metaTitle');

export default async function TestSectionPage({ params, searchParams }: TestSectionPageProps) {
  await initLocale(params);
  const { id, section } = await params;
  const skill = assertSkill(section);
  const { scope } = await searchParams;
  return <ExamSectionScreen id={id} section={skill} scope={scope === skill ? skill : 'full'} />;
}
