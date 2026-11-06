import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'use-intl';
import { errorsOf, loadTest, setTestPublished, testKeys, validateDraft, type TestRow } from '@/entities/test';
import { AppError } from '@/shared/api/app-error';

const assertPublishable = async (id: string) => {
  const { draft } = await loadTest(id);
  const errors = errorsOf(validateDraft(draft));
  if (errors.length) throw new AppError('publishBlocked', { count: errors.length });
};

export const useTogglePublish = () => {
  const t = useTranslations('publish');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, publish }: { id: string; publish: boolean }) => {
      if (publish) await assertPublishable(id);
      await setTestPublished(id, publish);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: testKeys.all }),
  });

  const toggle = (test: TestRow) => {
    const publish = test.published_at === null;
    const question = publish ? t('confirmPublish', { title: test.title }) : t('confirmHide', { title: test.title });
    if (window.confirm(question)) mutation.mutate({ id: test.id, publish });
  };

  const pendingId = mutation.isPending ? mutation.variables?.id : undefined;

  return { toggle, pendingId, error: mutation.error, reset: mutation.reset };
};
