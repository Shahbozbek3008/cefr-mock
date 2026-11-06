import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'use-intl';
import { deleteTest, testKeys, type TestRow } from '@/entities/test';

export const useDeleteTest = () => {
  const t = useTranslations('deleteTest');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testKeys.all }),
  });

  const remove = (test: TestRow) => {
    if (window.confirm(t('confirm', { title: test.title, id: test.id }))) mutation.mutate(test.id);
  };

  const pendingId = mutation.isPending ? mutation.variables : undefined;

  return { remove, pendingId, error: mutation.error, reset: mutation.reset };
};
