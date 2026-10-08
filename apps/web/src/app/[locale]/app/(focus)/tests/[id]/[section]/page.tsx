import { initLocale, metadataTitle } from '@/lib/i18n';
import { assertSkill, type TestSectionParams } from '@/lib/test-route';
import { ExamSectionScreen } from '@/components/exam/exam-section-screen';

export const generateMetadata = metadataTitle('test.metaTitle');

export default async function TestSectionPage({ params }: { params: TestSectionParams }) {
  await initLocale(params);
  const { id, section } = await params;
  return <ExamSectionScreen id={id} section={assertSkill(section)} />;
}
