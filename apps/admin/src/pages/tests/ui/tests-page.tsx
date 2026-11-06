import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'use-intl';
import { Button } from '@cefr/ui/components/button';
import { Spinner } from '@cefr/ui/components/spinner';
import { PageTitle } from '@cefr/ui/components/typography';
import { listTests, testKeys } from '@/entities/test';
import { ErrorNotice } from '@/shared/ui';
import { TestsTable } from '@/widgets/tests-table';

export default function TestsPage() {
  const t = useTranslations('tests');
  const navigate = useNavigate();
  const tests = useQuery({ queryKey: testKeys.all, queryFn: listTests });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle meta={t('subtitle')} title={t('title')} />
        <Button size="sm" icon={<Plus size={16} />} onClick={() => navigate('/tests/new')}>
          {t('new')}
        </Button>
      </div>
      <ErrorNotice error={tests.error} />
      {tests.isPending ? <Spinner size={20} className="text-ink-3" /> : tests.data && <TestsTable tests={tests.data} />}
    </div>
  );
}
