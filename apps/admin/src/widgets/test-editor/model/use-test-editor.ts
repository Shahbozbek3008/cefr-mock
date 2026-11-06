import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'use-intl';
import { errorsOf, saveTest, setTestPublished, testExists, testKeys, validateDraft, type TestDraft } from '@/entities/test';
import { AppError } from '@/shared/api/app-error';
import { useLeaveGuard } from './use-leave-guard';

type SuccessMessage = 'saved' | 'savedAndPublished' | 'hidden';

export type EditorOutcome = { kind: 'success'; message: SuccessMessage } | { kind: 'error'; error: unknown };

type Options = { initial: TestDraft; initialPublished: boolean; isNew: boolean };

export const useTestEditor = ({ initial, initialPublished, isNew }: Options) => {
  const t = useTranslations('editor');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<TestDraft>({ defaultValues: initial });
  const [published, setPublished] = useState(initialPublished);
  const [outcome, setOutcome] = useState<EditorOutcome | null>(null);
  const [revision, setRevision] = useState(0);
  const dirty = form.formState.isDirty;
  const guard = useLeaveGuard(dirty, t('confirmLeave'));

  const errorCount = () => errorsOf(validateDraft(form.getValues())).length;

  const refresh = () => queryClient.invalidateQueries({ queryKey: testKeys.all });

  const openSaved = (id: string) => {
    if (isNew) navigate(`/tests/${id}`, { replace: true });
  };

  const persist = async () => {
    const draft = form.getValues();
    const errors = errorCount();
    if (published && errors > 0) throw new AppError('publishedWithErrors', { count: errors });
    if (isNew && (await testExists(draft.id))) throw new AppError('idTaken', { id: draft.id });
    const saved = await saveTest(draft);
    guard.release();
    form.reset(saved);
    await refresh();
    return saved;
  };

  const attempt = async (task: () => Promise<SuccessMessage>) => {
    setOutcome(null);
    try {
      setOutcome({ kind: 'success', message: await task() });
      return true;
    } catch (error) {
      setOutcome({ kind: 'error', error });
      return false;
    }
  };

  const save = () =>
    attempt(async () => {
      const saved = await persist();
      openSaved(saved.id);
      return 'saved';
    });

  const publish = () =>
    attempt(async () => {
      const saved = await persist();
      await setTestPublished(saved.id, true);
      setPublished(true);
      await refresh();
      openSaved(saved.id);
      return 'savedAndPublished';
    });

  const hide = () =>
    attempt(async () => {
      await setTestPublished(form.getValues('id'), false);
      setPublished(false);
      await refresh();
      return 'hidden';
    });

  const togglePublish = () => {
    if (published) return window.confirm(t('confirmHide')) ? hide() : undefined;
    const errors = errorCount();
    if (errors > 0) {
      setOutcome({ kind: 'error', error: new AppError('publishBlocked', { count: errors }) });
      return undefined;
    }
    return window.confirm(t('confirmPublish')) ? publish() : undefined;
  };

  const importDraft = (draft: TestDraft) => {
    const current = form.getValues();
    const next = isNew ? draft : { ...draft, id: current.id, number: current.number };
    form.reset(next, { keepDefaultValues: true });
    setRevision((value) => value + 1);
  };

  return { form, published, dirty, outcome, revision, save, togglePublish, importDraft };
};
