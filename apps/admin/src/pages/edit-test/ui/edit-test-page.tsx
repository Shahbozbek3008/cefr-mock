import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@cefr/ui/components/spinner';
import { loadTest, testKeys } from '@/entities/test';
import { ErrorNotice } from '@/shared/ui';
import { TestEditor } from '@/widgets/test-editor';

export default function EditTestPage() {
  const { id = '' } = useParams();
  const test = useQuery({ queryKey: testKeys.detail(id), queryFn: () => loadTest(id), staleTime: Infinity, gcTime: 0 });

  if (test.isPending) return <Spinner size={20} className="text-ink-3" />;
  if (test.error) return <ErrorNotice error={test.error} />;

  return <TestEditor key={id} initial={test.data.draft} initialPublished={test.data.published} isNew={false} />;
}
