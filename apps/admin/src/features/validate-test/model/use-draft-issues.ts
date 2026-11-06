import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { validateDraft, type TestDraft } from '@/entities/test';

export const useDraftIssues = () => {
  const { control } = useFormContext<TestDraft>();
  const draft = useWatch({ control }) as TestDraft;
  return useMemo(() => validateDraft(draft), [draft]);
};
