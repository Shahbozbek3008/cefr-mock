import { initLocale, metadataTitle } from '@/lib/i18n';
import { assertSkill, type TestSectionParams } from '@/lib/test-route';
import { ExamSectionScreen } from '@/components/exam/exam-section-screen';

export const generateMetadata = metadataTitle('test.metaTitle');

type TestSectionPageProps = { params: TestSectionParams; searchParams: Promise<{ scope?: string }> };

export default async function TestSectionPage({ params, searchParams }: TestSectionPageProps) {
  await initLocale(params);
  const { id, section } = await params;
  const skill = assertSkill(section);
  const { scope } = await searchParams;
  return <ExamSectionScreen id={id} section={skill} scope={scope === skill ? skill : 'full'} />;
}
