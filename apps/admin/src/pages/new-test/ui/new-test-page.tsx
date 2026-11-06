import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@cefr/ui/components/spinner';
import { listTests, testKeys, type TestDraft } from '@/entities/test';
import { CreateTestForm } from '@/features/create-test';
import { ErrorNotice } from '@/shared/ui';
import { TestEditor } from '@/widgets/test-editor';

export default function NewTestPage() {
  const tests = useQuery({ queryKey: testKeys.all, queryFn: listTests });
  const [draft, setDraft] = useState<TestDraft | null>(null);

  if (draft) return <TestEditor initial={draft} initialPublished={false} isNew />;
  if (tests.isPending) return <Spinner size={20} className="text-ink-3" />;
  if (tests.error) return <ErrorNotice error={tests.error} />;

  const nextNumber = Math.max(0, ...tests.data.map((test) => test.number)) + 1;
  return <CreateTestForm tests={tests.data} nextNumber={nextNumber} onCreate={setDraft} />;
}
