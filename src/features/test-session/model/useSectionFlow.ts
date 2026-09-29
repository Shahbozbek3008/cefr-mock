import { useCallback, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { submitAttempt, useAttemptStore } from '@/entities/attempt';
import { notificationKeys } from '@/entities/notification';
import { requestAiReview, resultKeys } from '@/entities/result';
import { sectionOrder, testKeys } from '@/entities/test';
import type { SectionKind, TestDetail } from '@/entities/test';
import { useI18n } from '@/shared/i18n';
import { queryClient } from '@/shared/lib';
import { useToast } from '@/shared/ui';
import { flushAttempt } from './attemptSession';
import { flushUploads } from './recordingUploads';

const nextSection = (section: SectionKind) => sectionOrder[sectionOrder.indexOf(section) + 1] ?? null;

const refreshAfterSubmit = () =>
  Promise.all(
    [resultKeys.all, testKeys.all, notificationKeys.all].map((queryKey) => queryClient.invalidateQueries({ queryKey })),
  );

export const useSectionFlow = (test: TestDetail, section: SectionKind) => {
  const [finishing, setFinishing] = useState(false);
  const showToast = useToast((s) => s.show);
  const { t } = useI18n();

  const submitTest = useCallback(async () => {
    setFinishing(true);
    try {
      await flushUploads();
      await flushAttempt();
      const { attemptId } = useAttemptStore.getState();
      if (!attemptId) throw new Error('attempt_missing');
      const resultId = await submitAttempt(attemptId);
      requestAiReview(resultId).catch(() => undefined);
      await refreshAfterSubmit();
      useAttemptStore.getState().reset();
      router.replace({ pathname: '/result/[id]', params: { id: resultId, from: 'test' } });
    } catch {
      setFinishing(false);
      showToast({ message: t('session.submitFailed'), tone: 'error' });
    }
  }, [showToast, t]);

  const finish = useCallback(async () => {
    useAttemptStore.getState().completeSection(section);

    const next = nextSection(section);
    if (!next) {
      await submitTest();
      return;
    }
    flushAttempt().catch(() => undefined);
    router.replace({ pathname: '/test/[id]/[section]', params: { id: test.id, section: next } });
  }, [section, submitTest, test.id]);

  return { finish, finishing, submitTest };
};

export const useBackGuard = (onBack: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
      });
      return () => subscription.remove();
    }, [onBack]),
  );
};
