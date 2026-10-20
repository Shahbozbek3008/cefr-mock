import { useParams } from 'react-router';
import { useTranslations } from 'use-intl';
import { TestIntro } from '@/features/test-intro/ui/test-intro';
import { usePageTitle } from '@/shared/lib/use-page-title';

export default function PretestPage() {
  const { id = '' } = useParams();
  const t = useTranslations('pretest');
  usePageTitle(t('title'));
  return <TestIntro id={id} />;
}
