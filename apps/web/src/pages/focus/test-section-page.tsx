import { useParams, useSearchParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { ExamSectionScreen } from './exam-section-screen';
import { isSkill } from '@/entities/test';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function TestSectionPage() {
  const { id = '', section } = useParams();
  const [searchParams] = useSearchParams();
  const t = useTranslations('test');
  usePageTitle(t('metaTitle'));

  if (!isSkill(section)) return null;
  return <ExamSectionScreen id={id} section={section} scope={searchParams.get('scope') === section ? section : 'full'} />;
}
